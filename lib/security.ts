import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { NextRequest } from "next/server";

// Security constants
const SALT_ROUNDS = 12;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// Rate limiting storage (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// API Rate limiting storage (in production, use Redis)
const apiRequests = new Map<string, { count: number; windowStart: number }>();
const API_RATE_LIMIT = 100; // requests per window
const API_RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

export interface JWTPayload {
  userId?: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a secure JWT token
 */
export function generateJWT(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: SESSION_DURATION,
    issuer: "bilingual-news-website",
    audience: "admin-panel",
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "bilingual-news-website",
      audience: "admin-panel",
    }) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return request.ip || "unknown";
}

/**
 * Check if IP is rate limited for login attempts
 */
export function isRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip);

  if (!attempts) {
    return false;
  }

  // Check if lockout period has expired
  if (Date.now() - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return false;
  }

  return attempts.count >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Record a failed login attempt
 */
export function recordFailedLogin(ip: string): void {
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(ip, attempts);
}

/**
 * Clear login attempts for IP (on successful login)
 */
export function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(
  token: string,
  expectedToken: string
): boolean {
  if (!token || !expectedToken) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate input against common injection patterns
 */
export function validateInput(input: string): boolean {
  // Check for SQL injection patterns
  const sqlInjectionPattern =
    /(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)/i;

  // Check for XSS patterns
  const xssPattern =
    /(<script|<img|<iframe|<object|<embed|<link|<meta|javascript:|vbscript:|data:)/i;

  return !sqlInjectionPattern.test(input) && !xssPattern.test(input);
}

/**
 * Hash sensitive data for logging
 */
export function hashForLogging(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex").substring(0, 8);
}

/**
 * Generate secure random string
 */
export function generateSecureRandom(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Check for common weak passwords
  const commonPasswords = [
    "password",
    "123456",
    "admin",
    "qwerty",
    "letmein",
    "welcome",
    "password123",
    "admin123",
    "root",
    "toor",
  ];

  if (commonPasswords.some((weak) => password.toLowerCase().includes(weak))) {
    errors.push("Password contains common weak patterns");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if IP is rate limited for API requests
 */
export function isAPIRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = apiRequests.get(ip);

  if (!requests) {
    apiRequests.set(ip, { count: 1, windowStart: now });
    return false;
  }

  // Check if window has expired
  if (now - requests.windowStart > API_RATE_WINDOW) {
    apiRequests.set(ip, { count: 1, windowStart: now });
    return false;
  }

  // Increment request count
  requests.count += 1;

  return requests.count > API_RATE_LIMIT;
}

/**
 * Get current rate limit status for IP
 */
export function getRateLimitStatus(ip: string): {
  requests: number;
  limit: number;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const requests = apiRequests.get(ip);

  if (!requests || now - requests.windowStart > API_RATE_WINDOW) {
    return {
      requests: 0,
      limit: API_RATE_LIMIT,
      remaining: API_RATE_LIMIT,
      resetTime: now + API_RATE_WINDOW,
    };
  }

  return {
    requests: requests.count,
    limit: API_RATE_LIMIT,
    remaining: Math.max(0, API_RATE_LIMIT - requests.count),
    resetTime: requests.windowStart + API_RATE_WINDOW,
  };
}
