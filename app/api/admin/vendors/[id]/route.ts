import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import Vendor from "../../../../../models/Vendor";
import User from "../../../../../models/User";
import mongoose from "mongoose";
import { hasPermission } from "../../../../../lib/permissions";

export async function PATCH(req: Request, context: any) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "vendors:approve")) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const params = await Promise.resolve(context?.params) as { id?: string } | undefined;
  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const nextStatus = body.status;
  const rejectionReason = (body.rejectionReason || "").toString().trim();

  if (!nextStatus || !["approved", "rejected", "pending"].includes(nextStatus)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  await connectToDatabase();
  const vendor = await Vendor.findById(id);
  if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

  vendor.status = nextStatus;
  if (nextStatus === "approved") {
    vendor.rejectionReason = undefined;
    vendor.approvedAt = new Date();
    await User.updateOne({ _id: vendor.user }, { $set: { isActive: true, role: "vendor" } });
  } else if (nextStatus === "rejected") {
    vendor.rejectionReason = rejectionReason || "Rejected by admin";
    vendor.approvedAt = undefined;
    await User.updateOne({ _id: vendor.user }, { $set: { isActive: false, role: "vendor" } });
  } else {
    vendor.rejectionReason = undefined;
    vendor.approvedAt = undefined;
    await User.updateOne({ _id: vendor.user }, { $set: { isActive: false, role: "vendor" } });
  }

  await vendor.save();

  return NextResponse.json({ message: "Vendor updated" });
}
