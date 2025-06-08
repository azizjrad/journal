import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/db";
import { getClientIP } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days") || "30";

    // Security: Validate days parameter
    const days = parseInt(daysParam);
    if (isNaN(days) || days < 1 || days > 365) {
      console.warn(
        `Invalid days parameter in analytics request from ${clientIP}: ${daysParam}`
      );
      return NextResponse.json(
        { error: "Days parameter must be between 1 and 365" },
        { status: 400 }
      );
    }

    const analyticsData = await getAnalyticsData(days);

    console.log(
      `Analytics data requested by admin from ${clientIP} for ${days} days`
    );
    return NextResponse.json(analyticsData);
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Analytics API error from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
