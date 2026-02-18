import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import Distributer from "../../../../models/Distributer";

function validateEmail(email: string) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ownerName = (body.ownerName || body.name || "").toString().trim();
  const storeName = (body.storeName || "").toString().trim();
  const email = (body.email || "").toString().toLowerCase().trim();
  const contactEmail = (body.contactEmail || email || "").toString().toLowerCase().trim();
  const contactPhone = (body.contactPhone || "").toString().trim();
  const password = (body.password || "").toString();
  const address = (body.address || "").toString().trim();
  const description = (body.description || "").toString().trim();

  if (!storeName) return NextResponse.json({ message: "Store name is required" }, { status: 400 });
  if (!validateEmail(email)) return NextResponse.json({ message: "Valid account email is required" }, { status: 400 });
  if (!validateEmail(contactEmail)) return NextResponse.json({ message: "Valid contact email is required" }, { status: 400 });
  if (typeof password !== "string" || password.length < 8) return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });

  // prevent registering the admin account via distributer sign-up
  if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: "Registration using this email is not allowed" }, { status: 403 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email }).lean();
  if (existing) return NextResponse.json({ message: "Email already in use" }, { status: 409 });

  const user = await User.create({
    name: ownerName || undefined,
    email,
    password,
    role: "distributer",
    isActive: false,
  });

  try {
    await Distributer.create({
      user: user._id,
      ownerName: ownerName || undefined,
      storeName,
      contactEmail,
      contactPhone: contactPhone || undefined,
      address: address || undefined,
      description: description || undefined,
      status: "pending",
    });
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    throw err;
  }

  return NextResponse.json({ message: "Distributer request submitted" }, { status: 201 });
}
