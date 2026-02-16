import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import PaymentRequest from "../../../../../models/PaymentRequest";
import mongoose from "mongoose";
import { hasPermission } from "../../../../../lib/permissions";

export async function PATCH(req: Request, context: any) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "payments:write")) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const params = await Promise.resolve(context?.params) as { id?: string } | undefined;
  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const status = body.status;
  if (!status || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  await connectToDatabase();
  const request = await PaymentRequest.findById(id);
  if (!request) return NextResponse.json({ message: "Not found" }, { status: 404 });

  request.status = status;
  if (status === "approved") request.approvedAt = new Date();
  if (status === "rejected") request.approvedAt = undefined;
  await request.save();

  return NextResponse.json({ message: "Request updated" });
}
