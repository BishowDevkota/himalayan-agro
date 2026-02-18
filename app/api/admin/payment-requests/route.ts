import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import PaymentRequest from "../../../../models/PaymentRequest";
import Distributor from "../../../../models/Distributor";
import { hasPermission } from "../../../../lib/permissions";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "payments:read")) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await connectToDatabase();
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "";
  const filter: any = {};
  if (status) filter.status = status;

  const requests = await PaymentRequest.find(filter).sort({ createdAt: -1 }).lean();
  const vendorIds = requests.map((r: any) => r.distributor);
  const distributors = await Distributor.find({ _id: { $in: vendorIds } }).lean();
  const vendorById = new Map(distributors.map((v: any) => [String(v._id), v]));

  const payload = requests.map((r: any) => {
    const v = vendorById.get(String(r.distributor));
    return {
      _id: String(r._id),
      vendorId: String(r.distributor),
      storeName: v?.storeName || null,
      ownerName: v?.ownerName || null,
      amount: r.amount,
      status: r.status,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
      approvedAt: r.approvedAt ? new Date(r.approvedAt).toISOString() : null,
    };
  });

  return NextResponse.json({ requests: payload });
}
