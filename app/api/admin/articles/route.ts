import { NextRequest, NextResponse } from "next/server";
import { getArticles, createArticle, addTagToArticle } from "@/lib/db";
import { validateArticleData } from "@/lib/api-validation";

export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate article data
    const validation = validateArticleData(data, false);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Extract tags from the data
    const { tags, ...articleData } = validation.sanitizedData!;

    // Create the article
    const newArticle = await createArticle(articleData);

    // Add tags if provided
    if (tags && Array.isArray(tags)) {
      for (const tagId of tags) {
        await addTagToArticle(newArticle.id, tagId);
      }
    }

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
