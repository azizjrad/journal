import { type NextRequest, NextResponse } from "next/server";
import { createArticle, addTagToArticle } from "@/lib/db";
import { getClientIP, validateCSRFToken } from "@/lib/security";
import { validateArticleData } from "@/lib/api-validation";

export async function POST(request: NextRequest) {
  try {
    // Security: Get client IP for logging
    const clientIP = getClientIP(request);

    // Security: Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.warn(`Invalid JSON in article creation request from ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Security: Validate CSRF token
    const { csrfToken, ...articleBody } = body;
    const cookieCSRFToken = request.cookies.get("csrf-token")?.value;

    if (
      !csrfToken ||
      !cookieCSRFToken ||
      !validateCSRFToken(csrfToken, cookieCSRFToken)
    ) {
      console.warn(`Invalid CSRF token in article creation from ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Security: Validate and sanitize input
    const validation = validateArticleData(articleBody, false);
    if (!validation.isValid) {
      console.warn(
        `Invalid article data from ${clientIP}: ${validation.errors.join(", ")}`
      );
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const { tags, ...articleData } = validation.sanitizedData!;
    const article = await createArticle(articleData);

    // Add tags if provided
    if (tags && Array.isArray(tags)) {
      for (const tagId of tags) {
        await addTagToArticle(article.id, tagId);
      }
    }

    console.log(
      `Article created successfully by admin from ${clientIP}: ${article.id}`
    );
    return NextResponse.json(article);
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error creating article from ${clientIP}:`, error);

    // Security: Don't expose internal error details
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
