import { NextRequest, NextResponse } from "next/server";
import { getAllScheduledArticles } from "@/lib/db";

export async function GET() {
  try {
    const scheduledArticles = await getAllScheduledArticles();
    return NextResponse.json(scheduledArticles);
  } catch (error) {
    console.error("Schedule API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled articles" },
      { status: 500 }
    );
  }
}
