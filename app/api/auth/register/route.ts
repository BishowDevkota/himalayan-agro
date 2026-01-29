import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

function validateEmail(email: string) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email || "").toLowerCase().trim();
  const password = body.password || "";
  const name = (body.name || "").trim();

  if (!validateEmail(email)) return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
  if (typeof password !== "string" || password.length < 8) return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });

  // prevent registering the admin account via sign-up
  if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: "Registration using this email is not allowed" }, { status: 403 });
  }

  // TODO: rate-limit this endpoint (IP / account) in production

  await connectToDatabase();

  const existing = await User.findOne({ email }).lean();
  if (existing) return NextResponse.json({ message: "Email already in use" }, { status: 409 });

  // Create user with plaintext password and let the User model's pre-save hook
  // perform hashing. This ensures a single, consistent hashing step and avoids
  // double-hashing when Mongoose triggers the pre-save hook.
  const user = await User.create({ name: name || undefined, email, password, role: "user" });

  // return minimal user info (do NOT return password)
  return NextResponse.json({ id: user._id.toString(), email: user.email, name: user.name }, { status: 201 });
}