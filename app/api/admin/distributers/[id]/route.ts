import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import Distributer from "../../../../../models/Distributer";
import User from "../../../../../models/User";
import mongoose from "mongoose";
import { hasPermission } from "../../../../../lib/permissions";

export async function PATCH(req: Request, context: any) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "distributers:approve")) {
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
  const distributer = await Distributer.findById(id);
  if (!distributer) return NextResponse.json({ message: "Distributer not found" }, { status: 404 });

  distributer.status = nextStatus;
  if (nextStatus === "approved") {
    distributer.rejectionReason = undefined;
    distributer.approvedAt = new Date();
    await User.updateOne({ _id: distributer.user }, { $set: { isActive: true, role: "distributer" } });
  } else if (nextStatus === "rejected") {
    distributer.rejectionReason = rejectionReason || "Rejected by admin";
    distributer.approvedAt = undefined;
    await User.updateOne({ _id: distributer.user }, { $set: { isActive: false, role: "distributer" } });
  } else {
    distributer.rejectionReason = undefined;
    distributer.approvedAt = undefined;
    await User.updateOne({ _id: distributer.user }, { $set: { isActive: false, role: "distributer" } });
  }

  await distributer.save();

  return NextResponse.json({ message: "Distributer updated" });
}
