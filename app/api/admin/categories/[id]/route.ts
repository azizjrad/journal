import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/db";
import { getClientIP } from "@/lib/security";
import {
  validateCategoryData,
  validateIdParameter,
} from "@/lib/api-validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientIP = getClientIP(request);

    // Security: Validate ID parameter
    const idValidation = validateIdParameter(params.id);
    if (!idValidation.isValid) {
      console.warn(
        `Invalid category ID parameter from ${clientIP}: ${params.id}`
      );
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    // Security: Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.warn(`Invalid JSON in category update request from ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Security: Validate and sanitize input for updates
    const validation = validateCategoryData(body, true);
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

    // Generate slug from English name if provided and not already set
    const categoryData = validation.sanitizedData!;
    if (!categoryData.slug && categoryData.name_en) {
      categoryData.slug = categoryData.name_en
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const updatedCategory = await updateCategory(
      idValidation.id!,
      categoryData
    );

    console.log(
      `Category updated successfully by admin from ${clientIP}: ${idValidation.id}`
    );
    return NextResponse.json(updatedCategory);
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error updating category from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientIP = getClientIP(request);

    // Security: Validate ID parameter
    const idValidation = validateIdParameter(params.id);
    if (!idValidation.isValid) {
      console.warn(
        `Invalid category ID parameter from ${clientIP}: ${params.id}`
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
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
