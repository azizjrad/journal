import { NextRequest, NextResponse } from "next/server";
import {
  scheduleArticle,
  getScheduledArticles,
  publishScheduledArticle,
  cancelScheduledArticle,
} from "@/lib/db";

export async function GET() {
  try {
    const scheduledArticles = await getScheduledArticles();
    return NextResponse.json(scheduledArticles);
  } catch (error) {
    console.error("Schedule API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled articles" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  scheduleArticle,
  getScheduledArticles,
  publishScheduledArticle,
  cancelScheduledArticle,
} from "@/lib/db";
import { getClientIP, validateInput } from "@/lib/security";

export async function GET() {
  try {
    const scheduledArticles = await getScheduledArticles();
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

    // Security: Parse and validate request body
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

    // Security: Validate required fields
    if (!articleId || !scheduledFor) {
      console.warn(
        `Missing required fields in schedule request from ${clientIP}`
      );
      return NextResponse.json(
        { error: "Article ID and scheduled time are required" },
        { status: 400 }
      );
    }

    // Security: Validate articleId is a positive integer
    if (!Number.isInteger(articleId) || articleId <= 0) {
      console.warn(
        `Invalid article ID in schedule request from ${clientIP}: ${articleId}`
      );
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    // Security: Validate scheduledFor is a valid date string
    const scheduledDate = new Date(scheduledFor);
    if (isNaN(scheduledDate.getTime())) {
      console.warn(`Invalid scheduled date from ${clientIP}: ${scheduledFor}`);
      return NextResponse.json(
        { error: "Invalid scheduled date format" },
        { status: 400 }
      );
    }

    // Security: Ensure scheduled date is in the future
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "Scheduled date must be in the future" },
        { status: 400 }
      );
    }

    const result = await scheduleArticle(articleId, scheduledFor);

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
