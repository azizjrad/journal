import { NextRequest, NextResponse } from "next/server";
import { getAllScheduledArticles, createScheduledArticle } from "@/lib/db";
import { getClientIP, validateInput } from "@/lib/security";

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

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.warn(
        `Invalid JSON in schedule creation request from ${clientIP}`
      );
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }
    const { articleId, scheduledFor } = body;
    if (!articleId || !scheduledFor) {
      console.warn(
        `Missing required fields in schedule request from ${clientIP}`
      );
      return NextResponse.json(
        { error: "Article ID and scheduled time are required" },
        { status: 400 }
      );
    }
    if (!Number.isInteger(articleId) || articleId <= 0) {
      console.warn(
        `Invalid article ID in schedule request from ${clientIP}: ${articleId}`
      );
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }
    const scheduledDate = new Date(scheduledFor);
    if (isNaN(scheduledDate.getTime())) {
      console.warn(`Invalid scheduled date from ${clientIP}: ${scheduledFor}`);
      return NextResponse.json(
        { error: "Invalid scheduled date format" },
        { status: 400 }
      );
    }
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "Scheduled date must be in the future" },
        { status: 400 }
      );
    }
    const result = await createScheduledArticle({
      article_id: articleId,
      scheduled_for: scheduledFor,
      status: "scheduled",
    });
    console.log(
      `Article scheduled successfully by admin from ${clientIP}: Article ${articleId} for ${scheduledFor}`
    );
    return NextResponse.json(result);
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Schedule creation error from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Failed to schedule article" },
      { status: 500 }
    );
  }
}
