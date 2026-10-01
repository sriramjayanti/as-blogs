import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, signToken, TOKEN_NAME } from '@/lib/auth';

// Rate limiting map: IP -> { attempts: number, lockUntil: number, lastAttempt: number }
const loginAttempts = new Map<string, { attempts: number; lockUntil: number; lastAttempt: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const WINDOW_DURATION = 10 * 60 * 1000; // 10 minutes reset

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true };
  }

  // Check if locked out
  if (record.lockUntil && record.lockUntil > now) {
    const waitSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Reset if window has elapsed
  if (now - record.lastAttempt > WINDOW_DURATION) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordAttempt(ip: string, success: boolean) {
  const now = Date.now();
  if (success) {
    loginAttempts.delete(ip);
    return;
  }

  const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0, lastAttempt: now };
  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_DURATION;
  }

  loginAttempts.set(ip, record);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Please wait ${rateLimit.waitSeconds} seconds before trying again.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs exist and are non-empty strings
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Constant time comparison behavior against user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      recordAttempt(ip, false);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      recordAttempt(ip, false);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (user.role !== 'ADMIN') {
      recordAttempt(ip, false);
      return NextResponse.json(
        { error: 'Access restricted to system administrators.' },
        { status: 403 }
      );
    }

    // Success - reset attempts
    recordAttempt(ip, true);

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
