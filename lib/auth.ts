import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { TOKEN_NAME, verifyToken, AdminPayload } from './jwt';

export * from './jwt';

/**
 * Server-side helper to read and verify admin session from cookies
 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Secure password hashing with bcryptjs (work factor 10)
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Constant-time password comparison
 */
export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
