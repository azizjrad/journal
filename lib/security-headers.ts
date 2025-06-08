import { NextResponse } from "next/server";

/**
 * Add comprehensive security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: In production, remove unsafe-* and use nonces
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: blob: *.vercel.app *.amazonaws.com",
    "connect-src 'self' *.neon.tech *.neon.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  // Security headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // HSTS (only in production with HTTPS)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Remove server information
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");

  return response;
}

/**
 * CORS headers for API routes
 */
export function addCORSHeaders(
  response: NextResponse,
  origin?: string
): NextResponse {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean);

  const requestOrigin = origin || "";

  if (allowedOrigins.includes(requestOrigin)) {
    response.headers.set("Access-Control-Allow-Origin", requestOrigin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  return response;
}

/**
 * Generate Content Security Policy nonce
 */
export function generateCSPNonce(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString(
    "base64"
  );
}
