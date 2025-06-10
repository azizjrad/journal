import { NextRequest, NextResponse } from "next/server";

export function DELETE() {
  return NextResponse.json({ message: "Test DELETE working" });
}

export function GET() {
  return NextResponse.json({ message: "Test GET working" });
}
