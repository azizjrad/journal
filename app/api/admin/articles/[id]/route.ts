import { NextRequest, NextResponse } from "next/server";
import {
  updateArticle,
  deleteArticle,
  getArticleByIdAdmin,
  removeArticleTags,
  addTagToArticle,
} from "@/lib/db";
import { getClientIP, validateCSRFToken } from "@/lib/security";
import { validateArticleData, validateIdParameter } from "@/lib/api-validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clientIP = getClientIP(request);
    const { id: idParam } = await params;

    // Security: Validate ID parameter
    const idValidation = validateIdParameter(idParam);
    if (!idValidation.isValid) {
      console.warn(`Invalid article ID parameter from ${clientIP}: ${idParam}`);
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    const article = await getArticleByIdAdmin(idValidation.id!);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error fetching article from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clientIP = getClientIP(request);
    const { id: idParam } = await params;

    // Security: Validate ID parameter
    const idValidation = validateIdParameter(idParam);
    if (!idValidation.isValid) {
      console.warn(`Invalid article ID parameter from ${clientIP}: ${idParam}`);
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    } // Security: Parse and validate request body
    let data;
    try {
      data = await request.json();
    } catch (error) {
      console.warn(`Invalid JSON in article update request from ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Security: Validate CSRF token
    const { csrfToken, ...articleBody } = data;
    const cookieCSRFToken = request.cookies.get("csrf-token")?.value;

    if (
      !csrfToken ||
      !cookieCSRFToken ||
      !validateCSRFToken(csrfToken, cookieCSRFToken)
    ) {
      console.warn(`Invalid CSRF token in article update from ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Security: Validate and sanitize input for updates
    const validation = validateArticleData(articleBody, true);
    if (!validation.isValid) {
      console.warn(
        `Invalid article update data from ${clientIP}: ${validation.errors.join(
          ", "
        )}`
      );
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const { tags, ...articleData } = validation.sanitizedData!;
    const updatedArticle = await updateArticle(idValidation.id!, articleData);

    // Handle tags if provided
    if (tags && Array.isArray(tags)) {
      // Remove all existing tags for this article
      await removeArticleTags(idValidation.id!);

      // Add new tags
      for (const tagId of tags) {
        await addTagToArticle(idValidation.id!, tagId);
      }
    }

    console.log(
      `Article updated successfully by admin from ${clientIP}: ${idValidation.id}`
    );
    return NextResponse.json(updatedArticle);
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error updating article from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clientIP = getClientIP(request);
    const { id: idParam } = await params;

    // Security: Validate ID parameter
    const idValidation = validateIdParameter(idParam);
    if (!idValidation.isValid) {
      console.warn(`Invalid article ID parameter from ${clientIP}: ${idParam}`);
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    await deleteArticle(idValidation.id!);

    console.log(
      `Article deleted successfully by admin from ${clientIP}: ${idValidation.id}`
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error deleting article from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
