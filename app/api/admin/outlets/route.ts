import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import Outlet from "../../../../models/Outlet";
import { hasPermission } from "../../../../lib/permissions";

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !hasPermission(session.user, "admin")) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await connectToDatabase();
    const outlets = await Outlet.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ outlets });
  } catch (err: any) {
    console.error("Error in GET /api/admin/outlets:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !hasPermission(session.user, "admin")) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    await connectToDatabase();

    const slug = (body.slug || body.name || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!body.name || !slug) {
      return NextResponse.json({ message: "Outlet name is required" }, { status: 400 });
    }

    const existing = await Outlet.findOne({ slug });
    if (existing) {
      return NextResponse.json({ message: "Outlet with this name already exists" }, { status: 400 });
    }

    const outlet = await Outlet.create({
      name: body.name,
      slug,
      description: body.description || "",
      address: body.address || "",
      contactPhone: body.contactPhone || "",
      contactEmail: body.contactEmail || "",
      isActive: body.isActive !== false,
    });

    return NextResponse.json(outlet, { status: 201 });
  } catch (err: any) {
    console.error("Error in POST /api/admin/outlets:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
