import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET_STRING =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? '' // In production, must be provided via environment variables
    : 'as_brand_oils_super_secure_jwt_secret_token_2026_dev_only');

export const TOKEN_NAME = 'as_admin_auth_token';

// Secret key encoded as Uint8Array for jose
function getSecretKey(): Uint8Array {
  const secret = JWT_SECRET_STRING || 'as_brand_oils_fallback_emergency_secret_key_minimum_32_chars';
  return new TextEncoder().encode(secret);
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
 */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  if (!token) return null;
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    if (!payload.userId || !payload.email || payload.role !== 'ADMIN') {
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: (payload.name as string) || 'Admin',
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}
