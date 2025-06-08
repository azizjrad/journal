import { NextRequest, NextResponse } from "next/server";
import { getTags, createTag } from "@/lib/db";
import { getClientIP } from "@/lib/security";
import { validateTagData } from "@/lib/api-validation";

export async function GET() {
  try {
    const tags = await getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
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
      console.warn(`Invalid JSON in tag creation request from ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Security: Validate and sanitize input
    const validation = validateTagData(body, false);
    if (!validation.isValid) {
      console.warn(`Invalid tag data from ${clientIP}: ${validation.errors.join(', ')}`);
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const { name_en, name_ar, slug, description_en, description_ar } = validation.sanitizedData!;

    // Check if slug already exists
    const existingTagArr = await getTags();
    const existingTag = existingTagArr.find((t) => t.slug === slug);
    if (existingTag) {
      return NextResponse.json(
        { error: "A tag with this slug already exists" },
        { status: 409 }
      );
    }

    const newTag = await createTag({
      name_en,
      name_ar,
      slug,
      description_en,
      description_ar,
    });

    console.log(`Tag created successfully by admin from ${clientIP}: ${newTag.id}`);
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error creating tag from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
