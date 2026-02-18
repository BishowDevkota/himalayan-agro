import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import Distributor from "../../../../../models/Distributor";
import User from "../../../../../models/User";
import mongoose from "mongoose";
import { hasPermission } from "../../../../../lib/permissions";

export async function PATCH(req: Request, context: any) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "distributors:approve")) {
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
  const distributor = await Distributor.findById(id);
  if (!distributor) return NextResponse.json({ message: "Distributor not found" }, { status: 404 });

  distributor.status = nextStatus;
  if (nextStatus === "approved") {
    distributor.rejectionReason = undefined;
    distributor.approvedAt = new Date();
    await User.updateOne({ _id: distributor.user }, { $set: { isActive: true, role: "distributor" } });
  } else if (nextStatus === "rejected") {
    distributor.rejectionReason = rejectionReason || "Rejected by admin";
    distributor.approvedAt = undefined;
    await User.updateOne({ _id: distributor.user }, { $set: { isActive: false, role: "distributor" } });
  } else {
    distributor.rejectionReason = undefined;
    distributor.approvedAt = undefined;
    await User.updateOne({ _id: distributor.user }, { $set: { isActive: false, role: "distributor" } });
  }

  await distributor.save();

  return NextResponse.json({ message: "Distributor updated" });
}
