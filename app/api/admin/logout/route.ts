import { NextRequest, NextResponse } from "next/server";
import { addSecurityHeaders } from "@/lib/security-headers";
import { getClientIP, hashForLogging } from "@/lib/security";

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  try {
    console.log(`Admin logout from IP: ${hashForLogging(clientIP)}`);
    
    const response = NextResponse.json({ 
      success: true,
      message: "Logged out successfully"
    });

    // Clear the admin token cookie
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immediately
      path: "/admin"
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error(`Logout error from IP ${hashForLogging(clientIP)}:`, error);
    
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    );
  }
}
