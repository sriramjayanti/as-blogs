import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Valid image signatures (magic bytes)
function isValidImageBuffer(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 12) return false;

  const hexHeader = buffer.subarray(0, 4).toString('hex').toLowerCase();

  // JPEG / JPG: FF D8 FF
  if (ext === '.jpg' || ext === '.jpeg') {
    return hexHeader.startsWith('ffd8ff');
  }

  // PNG: 89 50 4E 47
  if (ext === '.png') {
    return hexHeader === '89504e47';
  }

  // GIF: 47 49 46 38 (GIF8)
  if (ext === '.gif') {
    return hexHeader === '47494638';
  }

  // WEBP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  if (ext === '.webp') {
    const isRiff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
    const isWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    return isRiff && isWebp;
  }

  // AVIF: ....ftypavif or ....ftypavis
  if (ext === '.avif') {
    const ftyp = buffer.subarray(4, 12).toString('ascii');
    return ftyp.includes('ftyp');
  }

  return false;
}

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // 1. Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 5MB.' },
        { status: 400 }
      );
    }

    if (file.size < 100) {
      return NextResponse.json({ error: 'Corrupt or empty file.' }, { status: 400 });
    }

    // 2. Validate MIME type & Extension
    const mimeType = (file.type || '').toLowerCase();
    const rawExt = path.extname(file.name || '').toLowerCase();

    if (!ALLOWED_MIME_TYPES.includes(mimeType) || !ALLOWED_EXTENSIONS.includes(rawExt)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPG, PNG, WEBP, AVIF, and GIF image files are permitted.' },
        { status: 400 }
      );
    }

    // Explicitly reject dangerous formats (SVGs, HTML, Executables)
    if (rawExt === '.svg' || mimeType.includes('svg') || mimeType.includes('html')) {
      return NextResponse.json(
        { error: 'Vector SVG and executable files are prohibited for security.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Inspect magic bytes
    if (!isValidImageBuffer(buffer, rawExt)) {
      return NextResponse.json(
        { error: 'File content does not match genuine image header signatures.' },
        { status: 400 }
      );
    }

    // 4. Strict filename sanitization and uniqueness
    const safeBaseName = path
      .basename(file.name, rawExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 50);

    const uniqueFileName = `${safeBaseName || 'recipe'}-${Date.now()}${rawExt}`;

    // Target upload folder strictly confined to public/recipes
    const uploadDir = path.resolve(process.cwd(), 'public', 'recipes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.resolve(uploadDir, uniqueFileName);

    // Path traversal verification
    if (!filePath.startsWith(uploadDir)) {
      return NextResponse.json({ error: 'Path traversal attempt detected.' }, { status: 400 });
    }

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/recipes/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'Failed to process file upload.' }, { status: 500 });
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
        const filePath = path.resolve(uploadDir, file);
        if (!filePath.startsWith(uploadDir)) return null;

        const stats = fs.statSync(filePath);
        return {
          fileName: file,
          url: `/recipes/${file}`,
          size: stats.size,
          modifiedAt: stats.mtime.toISOString(),
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ images: imageFiles });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve media library.' }, { status: 500 });
  }
}
