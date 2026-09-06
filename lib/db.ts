import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string | undefined {
  const existingUrl = process.env.DATABASE_URL;

  // External database (Neon, Supabase, PostgreSQL)
  if (existingUrl && !existingUrl.startsWith('file:')) {
    return existingUrl;
  }

  // In Vercel / AWS Lambda serverless runtime:
  // The deployed /var/task filesystem is strictly read-only.
  // SQLite needs write permissions to open the DB and create temporary lock/journal files.
  // We copy the bundled seed database to /tmp/dev.db where write operations are permitted.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDir = '/tmp';
    const targetDbPath = path.join(tmpDir, 'dev.db');

    try {
      if (!fs.existsSync(targetDbPath) || fs.statSync(targetDbPath).size === 0) {
        const candidatePaths = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.resolve('./prisma/dev.db'),
          path.join(process.cwd(), 'dev.db'),
          path.join(__dirname, '..', 'prisma', 'dev.db'),
          path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        ];

        for (const src of candidatePaths) {
          if (fs.existsSync(src) && fs.statSync(src).size > 0) {
            try {
              const tempCopy = `${targetDbPath}.${Date.now()}.${Math.random().toString(36).substring(7)}`;
              fs.copyFileSync(src, tempCopy);
              fs.renameSync(tempCopy, targetDbPath);
              break;
            } catch {
              if (fs.existsSync(targetDbPath) && fs.statSync(targetDbPath).size > 0) {
                break;
              }
            }
          }
        }
      }
    } catch {
      // Fallback if /tmp inspection fails
    }

    if (fs.existsSync(targetDbPath) && fs.statSync(targetDbPath).size > 0) {
      return `file:${targetDbPath}`;
    }
  }

  // Local / build fallback
  const localCandidates = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.resolve('./prisma/dev.db'),
  ];
  for (const p of localCandidates) {
    if (fs.existsSync(p)) {
      return `file:${p.replace(/\\/g, '/')}`;
    }
  }

  return existingUrl || 'file:./prisma/dev.db';
}

function createPrismaClient(): PrismaClient {
  const dbUrl = getDatabaseUrl();

  return new PrismaClient({
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
