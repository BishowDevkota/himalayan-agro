import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import connectToDatabase from "../../../lib/mongodb";
import PaymentRequest from "../../../models/PaymentRequest";
import Vendor from "../../../models/Vendor";
import AdminPaymentRequestsClient from "../../components/admin/AdminPaymentRequestsClient";

export default async function AdminPaymentRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const requests = await PaymentRequest.find({}).sort({ createdAt: -1 }).lean();
  const vendorIds = requests.map((r: any) => r.vendor);
  const vendors = await Vendor.find({ _id: { $in: vendorIds } }).lean();
  const vendorById = new Map(vendors.map((v: any) => [String(v._id), v]));

  const safe = requests.map((r: any) => {
    const v = vendorById.get(String(r.vendor));
    return {
      _id: String(r._id),
      vendorId: String(r.vendor),
      storeName: v?.storeName || null,
      ownerName: v?.ownerName || null,
      amount: r.amount,
      status: r.status,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
      approvedAt: r.approvedAt ? new Date(r.approvedAt).toISOString() : null,
    };
  });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Payment requests</h1>
            <p className="mt-2 text-sm text-slate-500">Review vendor payout requests and approve or reject.</p>
          </div>
        </div>

        <AdminPaymentRequestsClient initialRequests={safe} />
      </div>
    </main>
  );
}
