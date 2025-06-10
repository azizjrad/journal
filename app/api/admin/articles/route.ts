import { NextRequest, NextResponse } from "next/server";
import { createArticle, getAllArticlesAdmin } from "@/lib/db";

export function GET() {
  return (async () => {
    try {
      const articles = await getAllArticlesAdmin();
      return NextResponse.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      return NextResponse.json(
        { error: "Failed to fetch articles" },
        { status: 500 }
      );
    }
  })();
}

export function POST(request: NextRequest) {
  return (async () => {
    try {
      const body = await request.json();
      const {
        title_en,
        title_ar,
        content_en,
        content_ar,
        excerpt_en,
        excerpt_ar,
        image_url,
        category_id,
        is_published = false,
        is_featured = false,
        tags = [],
      } = body;

      // Validate required fields
      if (!title_en || !title_ar || !content_en || !content_ar) {
        return NextResponse.json(
          { error: "Title and content are required in both languages" },
          { status: 400 }
        );
      }

      const newArticle = await createArticle({
        title_en,
        title_ar,
        content_en,
        content_ar,
        excerpt_en,
        excerpt_ar,
        image_url,
        category_id: category_id ? parseInt(category_id) : 0,
        is_published,
        is_featured,
        tags,
        published_at: is_published ? new Date() : null,
      });

      return NextResponse.json(newArticle);
    } catch (error) {
      console.error("Error creating article:", error);
      return NextResponse.json(
        { error: "Failed to create article" },
        { status: 500 }
      );
    }
  })();
}
