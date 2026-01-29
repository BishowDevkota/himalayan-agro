import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";

function validateEmail(email: string) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = (body.name || "").trim() || undefined;
  const email = (body.email || "").toLowerCase().trim();
  const subject = (body.subject || "").trim() || undefined;
  const message = (body.message || "").trim();

  if (!validateEmail(email)) return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
  if (!message || message.length < 10) return NextResponse.json({ message: "Message must be at least 10 characters" }, { status: 400 });

  const doc: any = { name, email, subject, message, createdAt: new Date().toISOString() };

  // Persist if DB is configured (best-effort)
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const mongoose = await import("mongoose");
      await mongoose.connection.collection("messages").insertOne(doc);
    }
  } catch (err) {
    // don't fail the request if DB write fails — still return success to user,
    // but log for visibility
    console.warn("contact: failed to save message", err);
  }

  // Forward to webhook if configured (best-effort)
  try {
    if (process.env.CONTACT_WEBHOOK && typeof globalThis.fetch === "function") {
      globalThis.fetch(process.env.CONTACT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "contact.message", data: doc }),
      }).catch((err: any) => console.warn("contact webhook failed", err));
    }
  } catch (err) {
    console.warn("contact: webhook forward failed", err);
  }

  return NextResponse.json({ message: "Thanks — message received" }, { status: 201 });
}
