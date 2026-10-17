import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/db';

// Initialize Cloudinary if credentials exist
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ url: process.env.CLOUDINARY_URL });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}


// Robust image type detection from buffer magic bytes
function detectImageType(buffer: Buffer): { isValid: boolean; mimeType: string; ext: string } {
  if (!buffer || buffer.length < 12) {
    return { isValid: false, mimeType: '', ext: '' };
  }

  const hexHeader = buffer.subarray(0, 4).toString('hex').toLowerCase();

  // JPEG / JPG: FF D8 FF
  if (hexHeader.startsWith('ffd8ff')) {
    return { isValid: true, mimeType: 'image/jpeg', ext: '.jpg' };
  }

  // PNG: 89 50 4E 47
  if (hexHeader === '89504e47') {
    return { isValid: true, mimeType: 'image/png', ext: '.png' };
  }

  // GIF: 47 49 46 38
  if (hexHeader === '47494638') {
    return { isValid: true, mimeType: 'image/gif', ext: '.gif' };
  }

  // WEBP: RIFF .... WEBP
  const isRiff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
  const isWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  if (isRiff && isWebp) {
    return { isValid: true, mimeType: 'image/webp', ext: '.webp' };
  }

  // AVIF: ....ftyp
  const ftyp = buffer.subarray(4, 12).toString('ascii');
  if (ftyp.includes('ftyp')) {
    return { isValid: true, mimeType: 'image/avif', ext: '.avif' };
  }

  return { isValid: false, mimeType: '', ext: '' };
}

export async function POST(request: Request) {
  // Check admin authorization
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized. Your session may have expired. Please re-login.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file was provided.' }, { status: 400 });
    }

    // 1. Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Image size exceeds maximum limit of 10MB. Please choose a smaller image.' },
        { status: 400 }
      );
    }

    if (file.size < 50) {
      return NextResponse.json({ error: 'Uploaded file appears empty or corrupt.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Detect actual image format from buffer
    const detected = detectImageType(buffer);
    if (!detected.isValid) {
      return NextResponse.json(
        { error: 'Invalid image content. Only genuine JPG, PNG, WEBP, AVIF, or GIF photos are supported.' },
        { status: 400 }
      );
    }

    // 3. Prepare sanitized filename
    const rawExt = path.extname(file.name || '').toLowerCase();
    const safeExt = detected.ext || rawExt || '.jpg';
    const safeBaseName = path
      .basename(file.name || 'recipe', rawExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 40) || 'recipe';

    const uniqueFileName = `${safeBaseName}-${Date.now()}${safeExt}`;

    // 4. Multi-tier Image Storage Handler:
    // Tier 1: Cloudinary (Free tier persistent cloud CDN)
    // Tier 2: Vercel Blob (Built-in Vercel storage)
    // Tier 3: Local disk (public/recipes in local development)
    // Tier 4: Base64 fallback (emergency fallback)
    let publicUrl = '';
    let storageType = 'unknown';

    // Tier 1: Check for Cloudinary
    if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'as_blogs/recipes',
              public_id: `${safeBaseName}-${Date.now()}`,
              resource_type: 'image',
              format: detected.ext.replace('.', '') || undefined,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

        if (uploadResult?.secure_url) {
          publicUrl = uploadResult.secure_url;
          storageType = 'cloudinary';
        }
      } catch (cloudErr: any) {
        console.warn('Cloudinary upload warning:', cloudErr?.message);
      }
    }

    // Tier 2: Check for Vercel Blob
    if (!publicUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`recipes/${uniqueFileName}`, buffer, {
          access: 'public',
          contentType: detected.mimeType,
        });
        if (blob?.url) {
          publicUrl = blob.url;
          storageType = 'vercel_blob';
        }
      } catch (blobErr: any) {
        console.warn('Vercel Blob upload warning:', blobErr?.message);
      }
    }

    // Tier 3: Local disk storage (local development)
    if (!publicUrl) {
      try {
        const uploadDir = path.resolve(process.cwd(), 'public', 'recipes');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.resolve(uploadDir, uniqueFileName);
        if (filePath.startsWith(uploadDir)) {
          await fs.promises.writeFile(filePath, buffer);
          publicUrl = `/recipes/${uniqueFileName}`;
          storageType = 'filesystem';
        }
      } catch (diskError: any) {
        // Disk write unavailable (read-only environment on Vercel without cloud credentials)
        console.warn('Local disk write unavailable. Using Base64 fallback:', diskError?.message);
      }
    }

    // Tier 4: Fallback Base64 Data URL
    if (!publicUrl) {
      publicUrl = `data:${detected.mimeType};base64,${buffer.toString('base64')}`;
      storageType = 'inline_data_url';
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
      storage: storageType,
    });

  } catch (error: any) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process file upload.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  const seenUrls = new Set<string>();
  const images: Array<{
    fileName: string;
    url: string;
    title?: string;
    size?: number;
    source: string;
    modifiedAt: string;
  }> = [];

  // 1. Fetch images from Cloudinary library if credentials exist
  if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const cloudRes = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'as_blogs/recipes',
        max_results: 60,
      });
      if (cloudRes && cloudRes.resources) {
        for (const r of cloudRes.resources) {
          if (r.secure_url && !seenUrls.has(r.secure_url)) {
            seenUrls.add(r.secure_url);
            images.push({
              fileName: r.public_id.split('/').pop() || r.public_id,
              url: r.secure_url,
              size: r.bytes,
              source: 'cloudinary',
              modifiedAt: r.created_at || new Date().toISOString(),
            });
          }
        }
      }
    } catch (cErr: any) {
      console.warn('Could not fetch Cloudinary resources:', cErr?.message);
    }
  }

  // 2. Fetch images actively used in articles from the database
  try {
    const dbArticles = await prisma.article.findMany({
      where: {
        featuredImage: { not: '' },
      },
      select: {
        featuredImage: true,
        title: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 60,
    });

    for (const art of dbArticles) {
      if (art.featuredImage && !seenUrls.has(art.featuredImage)) {
        seenUrls.add(art.featuredImage);
        const namePart = art.featuredImage.startsWith('data:')
          ? `${art.title.slice(0, 30)} (Embedded)`
          : art.featuredImage.split('/').pop() || art.title;

        images.push({
          fileName: namePart,
          url: art.featuredImage,
          title: art.title,
          source: 'database',
          modifiedAt: art.updatedAt.toISOString(),
        });
      }
    }
  } catch (dbErr: any) {
    console.warn('Could not fetch database images:', dbErr?.message);
  }

  // 3. Scan local public/recipes directory if available
  try {
    const uploadDir = path.resolve(process.cwd(), 'public', 'recipes');
    if (fs.existsSync(uploadDir)) {
      const files = await fs.promises.readdir(uploadDir);
      for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
          const url = `/recipes/${file}`;
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            try {
              const filePath = path.resolve(uploadDir, file);
              const stats = fs.statSync(filePath);
              images.push({
                fileName: file,
                url,
                size: stats.size,
                source: 'filesystem',
                modifiedAt: stats.mtime.toISOString(),
              });
            } catch {
              // Ignore individual file stat error
            }
          }
        }
      }
    }
  } catch (fsErr: any) {
    console.warn('Could not read local recipes dir:', fsErr?.message);
  }

  // Sort: newest first
  images.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

  return NextResponse.json({ images });
}
