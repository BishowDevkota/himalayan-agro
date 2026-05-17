import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";

function validateEmail(email: string) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const phoneNumber = String(body.phoneNumber || "").trim();

  if (!name) return NextResponse.json({ message: "Full name is required" }, { status: 400 });
  if (!validateEmail(email)) return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });

  if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ message: "Registration using this email is not allowed" }, { status: 403 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email }).lean();
  if (existing) return NextResponse.json({ message: "Email already in use" }, { status: 409 });

  const user = await User.create({
    name,
    email,
    password,
    role: "user",
    phoneNumber,
    isActive: true,
  });

  return NextResponse.json(
    {
      message: "User account created successfully",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    { status: 201 }
  );
}