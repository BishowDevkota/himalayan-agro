import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import Vendor from "../../../../models/Vendor";
import User from "../../../../models/User";

async function requireAdmin() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return null;
  return session;
}

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Not found" }, { status: 404 });

  await connectToDatabase();
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "";
  const q = url.searchParams.get("q") || "";

  const filter: any = {};
  if (status) filter.status = status;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ storeName: rx }, { ownerName: rx }, { contactEmail: rx }];
  }

  const vendors = await Vendor.find(filter).sort({ createdAt: -1 }).lean();
  const userIds = vendors.map((v: any) => v.user);
  const users = await User.find({ _id: { $in: userIds } }).select("email isActive role").lean();
  const userById = new Map(users.map((u: any) => [String(u._id), u]));

  const payload = vendors.map((v: any) => {
    const u = userById.get(String(v.user));
    return {
      _id: String(v._id),
      userId: String(v.user),
      ownerName: v.ownerName || null,
      storeName: v.storeName,
      contactEmail: v.contactEmail,
      contactPhone: v.contactPhone || null,
      address: v.address || null,
      description: v.description || null,
      status: v.status,
      rejectionReason: v.rejectionReason || null,
      createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : null,
      approvedAt: v.approvedAt ? new Date(v.approvedAt).toISOString() : null,
      userEmail: u?.email || null,
      userRole: u?.role || null,
      userActive: !!u?.isActive,
    };
  });

  return NextResponse.json({ vendors: payload });
}
