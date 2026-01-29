import { NextResponse } from "next/server";

/**
 * Admin user-management API (soft-disabled).
 * All operations return 404 to prevent use while keeping code for restore.
 */
export async function GET() {
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
export async function PATCH() {
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
export async function DELETE() {
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
