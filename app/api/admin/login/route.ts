import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  generateJWT,
  getClientIP,
  isRateLimited,
  recordFailedLogin,
  clearLoginAttempts,
  validateInput,
  hashForLogging,
} from "@/lib/security";
import { addSecurityHeaders, addCORSHeaders } from "@/lib/security-headers";

// In production, this should be stored in a secure database with proper hashing
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeMMYUI.39HVySSqe"; // "SecureAdmin123!"

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  try {
    // CSRF protection: check token in header and cookie
    const csrfTokenHeader = request.headers.get("x-csrf-token");
    const csrfTokenCookie = request.cookies.get("csrf-token")?.value;
    if (!csrfTokenHeader || !csrfTokenCookie) {
      console.warn(
        `Missing CSRF token on login from IP: ${hashForLogging(clientIP)}`
      );
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      );
    }

    // Validate CSRF token
    if (
      !validateInput(csrfTokenHeader) ||
      !validateInput(csrfTokenCookie) ||
      !csrfTokenHeader ||
      !csrfTokenCookie ||
      !csrfTokenHeader.length ||
      !csrfTokenCookie.length ||
      csrfTokenHeader !== csrfTokenCookie
    ) {
      console.warn(
        `CSRF token mismatch on login from IP: ${hashForLogging(clientIP)}`
      );
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      );
    }

    // Check rate limiting
    if (isRateLimited(clientIP)) {
      console.warn(
        `Rate limited login attempt from IP: ${hashForLogging(clientIP)}`
      );

      const response = NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
          retryAfter: 15 * 60, // 15 minutes
        },
        { status: 429 }
      );

      return addSecurityHeaders(response);
    }

    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { password } = body;

    // Input validation
    if (!password || typeof password !== "string") {
      recordFailedLogin(clientIP);
      console.warn(
        `Invalid login payload from IP: ${hashForLogging(clientIP)}`
      );

      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      );
    }

    // Validate input for injection attempts
    if (!validateInput(password)) {
      recordFailedLogin(clientIP);
      console.warn(
        `Malicious login attempt detected from IP: ${hashForLogging(clientIP)}`
      );

      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, ADMIN_PASSWORD_HASH);

    if (isValidPassword) {
      // Clear failed attempts on successful login
      clearLoginAttempts(clientIP);

      // Generate secure JWT token
      const token = generateJWT({
        userId: "admin",
        isAdmin: true,
      });

      console.log(
        `Successful admin login from IP: ${hashForLogging(clientIP)}`
      );

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      // Set secure HTTP-only cookie
      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/admin",
      });

      return addSecurityHeaders(response);
    } else {
      // Record failed attempt
      recordFailedLogin(clientIP);

      console.warn(
        `Failed admin login attempt from IP: ${hashForLogging(clientIP)}`
      );

      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      );
    }
  } catch (error) {
    console.error(`Login error from IP ${hashForLogging(clientIP)}:`, error);

    recordFailedLogin(clientIP);

    return addSecurityHeaders(
      NextResponse.json({ error: "Internal server error" }, { status: 500 })
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  return addCORSHeaders(
    addSecurityHeaders(response),
    request.headers.get("origin") || ""
  );
}
