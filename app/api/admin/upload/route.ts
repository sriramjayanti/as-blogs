import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Verify file type
    const mimeType = file.type;
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(mimeType) && !file.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WEBP, AVIF, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and make unique
    const ext = path.extname(file.name) || '.jpg';
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'recipes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFileName);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/recipes/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'recipes');
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ images: [] });
    }

    const files = await fs.promises.readdir(uploadDir);
    const imageFiles = files
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i))
      .map((file) => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          fileName: file,
          url: `/recipes/${file}`,
          size: stats.size,
          modifiedAt: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ images: imageFiles });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to list images' },
      { status: 500 }
    );
  }
}
