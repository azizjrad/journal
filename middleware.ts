import { NextRequest, NextResponse } from "next/server";
import {
  verifyJWT,
  getClientIP,
  isAPIRateLimited,
  getRateLimitStatus,
} from "@/lib/security";
import { addSecurityHeaders } from "@/lib/security-headers";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers to all responses
  addSecurityHeaders(response);

  // Get client IP for security logging
  const clientIP = getClientIP(request);

  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip login page itself
    if (request.nextUrl.pathname === "/admin/login") {
      return response;
    }

    // Check for auth token
    const token = request.cookies.get("admin-token");

    if (!token?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify JWT token
    const payload = verifyJWT(token.value);

    if (!payload || !payload.isAdmin) {
      // Clear invalid token
      const redirectResponse = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      redirectResponse.cookies.delete("admin-token");
      return addSecurityHeaders(redirectResponse);
    }

    // Add user info to headers for API routes
    response.headers.set("X-User-ID", payload.userId || "admin");
    response.headers.set("X-User-Role", "admin");
  }
  // API route security and rate limiting
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Skip rate limiting for login endpoint (has its own rate limiting)
    if (!request.nextUrl.pathname.startsWith("/api/admin/login")) {
      // Check API rate limiting
      if (isAPIRateLimited(clientIP)) {
        console.warn(`API rate limit exceeded from IP: ${clientIP}`);
        const rateLimitResponse = NextResponse.json(
          {
            error: "Too many requests. Please try again later.",
            retryAfter: 15 * 60, // 15 minutes
          },
          { status: 429 }
        );

        // Add rate limit headers
        const rateLimitStatus = getRateLimitStatus(clientIP);
        rateLimitResponse.headers.set(
          "X-RateLimit-Limit",
          rateLimitStatus.limit.toString()
        );
        rateLimitResponse.headers.set("X-RateLimit-Remaining", "0");
        rateLimitResponse.headers.set(
          "X-RateLimit-Reset",
          rateLimitStatus.resetTime.toString()
        );

        return addSecurityHeaders(rateLimitResponse);
      }
    }

    // Add rate limiting headers to all API responses
    const rateLimitStatus = getRateLimitStatus(clientIP);
    response.headers.set("X-RateLimit-Limit", rateLimitStatus.limit.toString());
    response.headers.set(
      "X-RateLimit-Remaining",
      rateLimitStatus.remaining.toString()
    );
    response.headers.set(
      "X-RateLimit-Reset",
      rateLimitStatus.resetTime.toString()
    );

    // Log API access for security monitoring
    console.log(
      `API Access: ${request.method} ${request.nextUrl.pathname} from ${clientIP}`
    );
  }

  // Block suspicious requests
  const userAgent = request.headers.get("user-agent") || "";
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /wget/i,
    /curl/i,
  ];

  const isSuspicious = suspiciousPatterns.some((pattern) =>
    pattern.test(userAgent)
  );

  if (isSuspicious && !request.nextUrl.pathname.startsWith("/api/track")) {
    // Allow legitimate bots for SEO but block on sensitive routes
    if (
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/api/admin")
    ) {
      return new NextResponse("Access Denied", { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
