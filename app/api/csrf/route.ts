import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken, getClientIP } from "@/lib/security";
import { addSecurityHeaders } from "@/lib/security-headers";

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Generate a new CSRF token
    const csrfToken = generateCSRFToken();

    const response = NextResponse.json({ csrfToken });

    // Set CSRF token as HTTP-only cookie for validation
    response.cookies.set("csrf-token", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    console.log(`CSRF token generated for IP: ${clientIP}`);
    return addSecurityHeaders(response);
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`CSRF token generation error from ${clientIP}:`, error);

    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to generate CSRF token" },
        { status: 500 }
      )
    );
  }
}
