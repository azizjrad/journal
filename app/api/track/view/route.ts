import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, title } = body;

    // Get client IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "127.0.0.1";

    // Get user agent and referer
    const userAgent = request.headers.get("user-agent") || "";
    const referer = body.referer || ""; // Simple country/city detection (you could enhance this with a GeoIP service)
    let country = "XX"; // Default unknown country code (2 chars)
    let city = "Unknown";

    // For development, set some default values
    if (
      ip.startsWith("127.0.0.1") ||
      ip.startsWith("::1") ||
      ip.startsWith("192.168.")
    ) {
      country = "LC"; // "Local" as 2-character code
      city = "Dev"; // Shorter city name
    }

    // Insert view record
    await sql`
      INSERT INTO article_views (article_id, ip_address, country, city, viewed_at, user_agent, referer)
      VALUES (${articleId}, ${ip}, ${country}, ${city}, NOW(), ${userAgent}, ${referer})
    `;

    console.log(`📊 View tracked: Article ${articleId} (${title}) from ${ip}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
