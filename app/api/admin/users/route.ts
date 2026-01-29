import { NextResponse } from "next/server";

/**
 * Admin user-management API (soft-disabled).
 * Returning 404 so the UI/API cannot be used but code remains for easy restore.
 */
export async function GET() {
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
