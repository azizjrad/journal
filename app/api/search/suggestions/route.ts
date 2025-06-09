import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/db";
import { getClientIP, validateInput, sanitizeInput } from "@/lib/simple-security";

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    // Security: Validate and sanitize search query
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 100) {
      console.warn(
        `Search query too long from ${clientIP}: ${trimmedQuery.length} chars`
      );
      return NextResponse.json(
        { error: "Search query too long" },
        { status: 400 }
      );
    }

    if (!validateInput(trimmedQuery)) {
      console.warn(
        `Suspicious search query from ${clientIP}: ${trimmedQuery.substring(
          0,
          50
        )}`
      );
      return NextResponse.json([]);
    }

    const sanitizedQuery = sanitizeInput(trimmedQuery);
    const suggestions = await getSearchSuggestions(sanitizedQuery);

    return NextResponse.json(suggestions);
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Error fetching search suggestions from ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
