import { NextRequest, NextResponse } from "next/server";
import { publishScheduledArticle } from "@/lib/db";
import { getClientIP } from "@/lib/security";
import { validateIdParameter } from "@/lib/api-validation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clientIP = getClientIP(request);
    const { id } = await params;

    // Security: Validate ID parameter
    const idValidation = validateIdParameter(id);
    if (!idValidation.isValid) {
      console.warn(`Invalid schedule ID parameter from ${clientIP}: ${id}`);
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    await publishScheduledArticle(idValidation.id!);

    console.log(
      `Scheduled article published successfully by admin from ${clientIP}: ${idValidation.id}`
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Publish scheduled article error from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Failed to publish scheduled article" },
      { status: 500 }
    );
  }
}
