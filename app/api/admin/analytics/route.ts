import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days") || "30";

    // Validate days parameter
    const days = parseInt(daysParam);
    if (isNaN(days) || days < 1 || days > 365) {
      return NextResponse.json(
        { error: "Days parameter must be between 1 and 365" },
        { status: 400 }
      );
    }

    const analyticsData = await getAnalyticsData(days);
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
