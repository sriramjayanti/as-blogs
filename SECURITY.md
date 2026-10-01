# Security Policy & Architecture Guide — A.S. Blogs Platform

This document outlines the security architecture, authentication mechanisms, authorization boundaries, and production hardening procedures implemented across the A.S. Blogs platform.

---

## 1. Authentication Architecture

The application implements defense-in-depth authentication using standards-compliant, cryptographic JSON Web Tokens (JWT) signed via `jose` using HS256:

```
[Visitor Browser]
       │
       ▼ (Accesses /admin/*)
[Next.js Edge Middleware] ─── (Cryptographically verifies JWT signature) ───► Invalid / Expired?
       │                                                                            │
       │ Valid Session                                                              ▼
       ▼                                                                  Redirect to /admin/login
[Server Component / API Route]
       │
       ▼ (getAdminSession verification)
[Prisma Database Layer]
```

### Key Security Safeguards
1. **Cryptographic Verification at Edge**: `middleware.ts` cryptographically validates token signatures on every request to `/admin/*` and `/api/admin/*` before server execution.
2. **HTTP-Only, Secure Cookie Storage**:
   - `as_admin_auth_token` is stored with `HttpOnly: true`, preventing access via JavaScript (`document.cookie`), mitigating XSS token theft.
   - `SameSite: Lax` protects against Cross-Site Request Forgery (CSRF).
   - `Secure: true` in production ensures tokens are only transmitted over TLS/HTTPS.
3. **Session Expiration**: Sessions automatically expire after 7 days.
4. **Brute Force Protection**: `/api/auth/login` enforces client IP rate limiting and temporary lockouts after 5 consecutive failed attempts.
5. **No Credential Exposure**: Passwords and secret keys are never hardcoded or pre-filled in frontend client code.

---

## 2. Authorization Model

Authorization is strictly enforced **server-side**; user interface states and hidden buttons are never relied upon for security:

| Role | Access Level | Capabilities |
| :--- | :--- | :--- |
| **Public Visitor** | Read-Only | View published articles, explore categories, search recipes, view products. |
| **Administrator** (`ADMIN`) | Full Control | Create, edit, publish, delete articles; manage product catalog; configure contextual rules; upload images. |

Every administrative API endpoint (`/api/admin/*`) independently checks `getAdminSession()` and verifies `session.role === 'ADMIN'` before executing database operations.

---

## 3. Blog Content & XSS Protection

Because editorial content contains rich HTML:
1. **Strict Sanitization**: All content submitted through the editor is sanitized via `sanitizeArticleContent()` using `sanitize-html` with an allowlist of safe HTML tags and attributes.
2. **Script & Event Handler Blocking**: `<script>`, `onload`, `onclick`, and `javascript:` pseudo-protocols are stripped.
3. **Iframe Restriction**: Iframes are restricted to approved domains (`youtube.com`, `player.vimeo.com`).
4. **Contextual Promotion Links**: Dynamic product attributes inserted by `lib/promotion-engine.ts` are escaped with `escapeHtmlAttribute()` to prevent attribute breakout attacks.

---

## 4. Media & File Upload Security

The `/api/admin/upload` endpoint implements strict multi-layer upload validation:
- **Authentication**: Administrator session required.
- **MIME & Extension Whitelist**: Only `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif` are permitted.
- **Magic Bytes Verification**: File header signatures are inspected to ensure file contents genuinely match image formats.
- **SVG / Executable Prohibition**: Vector SVGs and executable binaries are rejected to prevent SVG-based XSS.
- **Filename Sanitization & Path Traversal Prevention**: Filenames are sanitized to alphanumeric characters and timestamps, confined to the upload directory.
- **Size Limitation**: Uploads are restricted to a maximum of 5MB.

---

## 5. Production Security Headers

The platform sets HTTP security headers via `next.config.mjs` and `middleware.ts`:
- **Content-Security-Policy (CSP)**: Restricts script, style, image, font, and frame sources.
- **Strict-Transport-Security (HSTS)**: `max-age=63072000; includeSubDomains; preload` enforces HTTPS.
- **X-Frame-Options**: `SAMEORIGIN` prevents clickjacking.
- **X-Content-Type-Options**: `nosniff` prevents MIME-type confusion attacks.
- **Referrer-Policy**: `origin-when-cross-origin`.
- **Permissions-Policy**: Restricts camera, microphone, geolocation, and browsing-topics.
- **X-Robots-Tag**: `noindex, nofollow, noarchive` on all administrative interfaces.
- **X-Powered-By**: Disabled to eliminate server technology fingerprinting.

---

## 6. Vercel Deployment Checklist

Before deploying to Vercel production:
1. Set `DATABASE_URL` in Vercel Project Settings to your production database.
2. Set `JWT_SECRET` to a cryptographically strong, randomly generated string (minimum 32 characters, preferably 64 characters).
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://asbrandoils.com`).
4. Ensure `.env` and `.env.production` remain in `.gitignore`.
5. Rotate any credentials that were previously used in local development.

---

## 7. Reporting a Vulnerability

If you discover a security vulnerability within this project, please report it responsibly by contacting:
- **Security Contact**: security@asbrandoils.com
- Do not publicly disclose vulnerabilities in issue trackers until they have been patched.
