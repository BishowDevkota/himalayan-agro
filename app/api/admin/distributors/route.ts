import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import Distributor from "../../../../models/Distributor";
import User from "../../../../models/User";
import { hasPermission } from "../../../../lib/permissions";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "distributors:read")) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

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

  const distributors = await Distributor.find(filter).sort({ createdAt: -1 }).lean();
  const userIds = distributors.map((v: any) => v.user);
  const users = await User.find({ _id: { $in: userIds } }).select("email isActive role").lean();
  const userById = new Map(users.map((u: any) => [String(u._id), u]));

  const payload = distributors.map((v: any) => {
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

  return NextResponse.json({ distributors: payload });
}
