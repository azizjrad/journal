import { NextRequest, NextResponse } from "next/server";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/db";
import { getClientIP } from "@/lib/security";
import {
  validateCategoryData,
  validateIdParameter,
} from "@/lib/api-validation";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Security: Parse and validate request body
    let data;
    try {
      data = await request.json();
    } catch (error) {
      console.warn(
        `Invalid JSON in category creation request from ${clientIP}`
      );
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Security: Validate and sanitize input
    const validation = validateCategoryData(data, false);
    if (!validation.isValid) {
      console.warn(
        `Invalid category data from ${clientIP}: ${validation.errors.join(
          ", "
        )}`
      );
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Generate slug from English name if not provided
    const categoryData = validation.sanitizedData!;
    if (!categoryData.slug && categoryData.name_en) {
      categoryData.slug = categoryData.name_en
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const newCategory = await createCategory(categoryData);

    console.log(
      `Category created successfully by admin from ${clientIP}: ${newCategory.id}`
    );
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error creating category from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Security: Parse and validate request body
    let data;
    try {
      data = await request.json();
    } catch (error) {
      console.warn(`Invalid JSON in category update request from ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Security: Validate ID parameter
    const { id, ...categoryData } = data;
    if (!id || !Number.isInteger(id) || id <= 0) {
      console.warn(`Invalid category ID from ${clientIP}: ${id}`);
      return NextResponse.json(
        { error: "Valid category ID is required" },
        { status: 400 }
      );
    }

    // Security: Validate and sanitize input for updates
    const validation = validateCategoryData(categoryData, true);
    if (!validation.isValid) {
      console.warn(
        `Invalid category update data from ${clientIP}: ${validation.errors.join(
          ", "
        )}`
      );
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const updatedCategory = await updateCategory(id, validation.sanitizedData!);

    console.log(
      `Category updated successfully by admin from ${clientIP}: ${id}`
    );
    return NextResponse.json(updatedCategory);
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error updating category from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id") || "0";

    // Security: Validate ID parameter
    const idValidation = validateIdParameter(idParam);
    if (!idValidation.isValid) {
      console.warn(
        `Invalid category ID parameter from ${clientIP}: ${idParam}`
      );
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    await deleteCategory(idValidation.id!);

    console.log(
      `Category deleted successfully by admin from ${clientIP}: ${idValidation.id}`
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error deleting category from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
