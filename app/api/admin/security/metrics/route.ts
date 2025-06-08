import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, getClientIP, validateCSRFToken } from "@/lib/security";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Security: Verify JWT token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      console.warn(
        `Unauthorized security metrics access attempt from ${clientIP}`
      );
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      console.warn(`Invalid token in security metrics access from ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Security: Validate CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    if (!csrfToken || !validateCSRFToken(csrfToken)) {
      console.warn(
        `Invalid CSRF token in security metrics request from ${clientIP}`
      );
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Get security metrics
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Mock security metrics for demonstration
    // In a real implementation, these would come from security logs
    const securityMetrics = {
      overview: {
        totalSecurityEvents: 142,
        blockedAttacks: 12,
        suspiciousRequests: 25,
        rateLimitHits: 8,
        lastUpdated: now.toISOString(),
      },
      threatSummary: [
        { type: "SQL Injection Attempts", count: 3, severity: "high" },
        { type: "XSS Attempts", count: 5, severity: "medium" },
        { type: "CSRF Attacks", count: 2, severity: "medium" },
        { type: "Rate Limit Violations", count: 8, severity: "low" },
        { type: "Invalid JWT Tokens", count: 15, severity: "medium" },
      ],
      recentEvents: [
        {
          id: 1,
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          type: "SQL Injection Attempt",
          ip: "192.168.1.100",
          endpoint: "/api/admin/articles",
          action: "Blocked",
          severity: "high",
        },
        {
          id: 2,
          timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
          type: "Rate Limit Hit",
          ip: "10.0.0.50",
          endpoint: "/api/track/view",
          action: "Rate Limited",
          severity: "low",
        },
        {
          id: 3,
          timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
          type: "Invalid CSRF Token",
          ip: "172.16.0.25",
          endpoint: "/api/admin/login",
          action: "Rejected",
          severity: "medium",
        },
      ],
      rateLimitStatus: {
        currentRequests: 45,
        maxRequests: 100,
        resetTime: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
        blockedIPs: ["192.168.1.100", "10.0.0.200"],
      },
      systemHealth: {
        securityHeaders: "active",
        csrfProtection: "active",
        rateLimiting: "active",
        inputValidation: "active",
        authenticationSystem: "active",
        encryptionStatus: "active",
      },
    };

    console.log(`Security metrics accessed by admin from ${clientIP}`);

    return NextResponse.json({
      success: true,
      data: securityMetrics,
    });
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Security metrics error from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch security metrics" },
      { status: 500 }
    );
  }
}
