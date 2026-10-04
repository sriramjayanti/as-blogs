import { SignJWT, jwtVerify } from 'jose';

export const TOKEN_NAME = 'as_admin_auth_token';

const PRIMARY_SECRET =
  process.env.JWT_SECRET ||
  'as_brand_oils_super_secure_jwt_secret_token_2026_seo_mag';

// Secret key encoded as Uint8Array for jose
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(PRIMARY_SECRET);
}

export interface AdminPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Signs a secure JWT session token using jose (HS256) - Edge & Node compatible
 */
export async function signToken(payload: AdminPayload): Promise<string> {
  const secretKey = getSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Cryptographically verifies JWT token (100% Edge runtime compatible, zero Node.js dependencies)
 * Supports primary secret and seamless backward-compatible rotation keys so sessions don't suddenly break.
 */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  if (!token) return null;

  const candidateSecrets = [
    process.env.JWT_SECRET,
    'as_brand_oils_super_secure_jwt_secret_token_2026_seo_mag',
    'as_brand_oils_super_secure_jwt_secret_token_2026',
    'as_brand_oils_fallback_emergency_secret_key_minimum_32_chars',
  ].filter(Boolean) as string[];

  for (const secret of candidateSecrets) {
    try {
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
      });

      if (!payload.userId || !payload.email || payload.role !== 'ADMIN') {
        continue;
      }

      return {
        userId: payload.userId as string,
        email: payload.email as string,
        name: (payload.name as string) || 'Admin',
        role: payload.role as string,
      };
    } catch {
      // Try next secret in keyring
    }
  }

  return null;
}
