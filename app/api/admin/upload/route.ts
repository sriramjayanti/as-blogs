import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

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

    // 1. Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Image size exceeds maximum limit of 5MB. Please compress or choose a smaller image.' },
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

    // 4. Attempt to write to local public/recipes
    let publicUrl = '';
    let savedToDisk = false;

    try {
      const uploadDir = path.resolve(process.cwd(), 'public', 'recipes');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.resolve(uploadDir, uniqueFileName);
      if (filePath.startsWith(uploadDir)) {
        await fs.promises.writeFile(filePath, buffer);
        publicUrl = `/recipes/${uniqueFileName}`;
        savedToDisk = true;
      }
    } catch (diskError: any) {
      // Disk write failed (typical on Vercel serverless read-only filesystem EROFS)
      // Fallback: encode as Base64 Data URL so the photo is 100% saved and usable!
      console.warn('Local disk write unavailable (Vercel serverless environment). Using Base64 Data URL fallback:', diskError?.message);
      publicUrl = `data:${detected.mimeType};base64,${buffer.toString('base64')}`;
      savedToDisk = false;
    }

    if (!publicUrl) {
      // If disk failed and base64 failed, generate direct data URL
      publicUrl = `data:${detected.mimeType};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
      storage: savedToDisk ? 'filesystem' : 'inline_data_url',
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

  try {
    const uploadDir = path.resolve(process.cwd(), 'public', 'recipes');
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ images: [] });
    }

    const files = await fs.promises.readdir(uploadDir);
    const imageFiles = files
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i))
      .map((file) => {
        try {
          const filePath = path.resolve(uploadDir, file);
          if (!filePath.startsWith(uploadDir)) return null;

          const stats = fs.statSync(filePath);
          return {
            fileName: file,
            url: `/recipes/${file}`,
            size: stats.size,
            modifiedAt: stats.mtime.toISOString(),
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ images: imageFiles });
  } catch (error: any) {
    console.warn('Could not read local recipes directory:', error?.message);
    return NextResponse.json({ images: [] });
  }
}
