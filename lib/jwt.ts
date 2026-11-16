import { SignJWT, jwtVerify } from 'jose';

export const TOKEN_NAME = 'as_admin_auth_token';

function getJwtSecrets(): string[] {
  const secrets: string[] = [];

  if (process.env.JWT_SECRET?.trim()) {
    secrets.push(process.env.JWT_SECRET.trim());
  }

  // Support seamless key rotation via JWT_SECRET_ROTATION or JWT_SECRET_PREVIOUS
  if (process.env.JWT_SECRET_ROTATION?.trim()) {
    secrets.push(process.env.JWT_SECRET_ROTATION.trim());
  }
  if (process.env.JWT_SECRET_PREVIOUS?.trim()) {
    secrets.push(process.env.JWT_SECRET_PREVIOUS.trim());
  }

  if (secrets.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SECURITY CRITICAL: JWT_SECRET environment variable is not configured. Server refused to use hardcoded secrets in production.'
      );
    }
    // Local development fallback only
    secrets.push('dev_local_only_secret_minimum_32_characters_long_for_security');
  }

  return secrets;
}

function getSigningKey(): Uint8Array {
  const secrets = getJwtSecrets();
  return new TextEncoder().encode(secrets[0]);
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
  const secretKey = getSigningKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Cryptographically verifies JWT token (100% Edge runtime compatible, zero Node.js dependencies)
 * Only accepts tokens signed by configured environment secrets.
 */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  if (!token) return null;

  let candidateSecrets: string[] = [];
  try {
    candidateSecrets = getJwtSecrets();
  } catch {
    return null;
  }

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
      // Try next valid rotation secret
    }
  }

  return null;
}
