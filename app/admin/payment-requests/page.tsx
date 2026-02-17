import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import connectToDatabase from "../../../lib/mongodb";
import PaymentRequest from "../../../models/PaymentRequest";
import Vendor from "../../../models/Vendor";
import AdminPaymentRequestsClient from "../../components/admin/AdminPaymentRequestsClient";
import { hasPermission } from "../../../lib/permissions";

export default async function AdminPaymentRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "payments:read")) return <div className="p-12">Unauthorized</div>;

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

  const pendingCount = safe.filter((r: any) => r.status === "pending").length;
  const approvedCount = safe.filter((r: any) => r.status === "approved").length;
  const rejectedCount = safe.filter((r: any) => r.status === "rejected").length;
  const totalAmount = safe.reduce((sum: number, r: any) => sum + (typeof r.amount === "number" ? r.amount : 0), 0);

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Finance</span>
            <h1 className="mt-3 text-4xl font-black text-slate-900">Payment requests</h1>
            <p className="mt-3 text-sm text-slate-500">
              Review vendor payout requests and approve or reject.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/payment-requests"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700"
            >
              Refresh
            </a>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Total Requests</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{safe.length}</div>
                <div className="mt-2 text-sm text-slate-400">All payout requests</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">₹</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Pending</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{pendingCount}</div>
                <div className="mt-2 text-sm text-slate-400">Awaiting action</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold">P</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Approved</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{approvedCount}</div>
                <div className="mt-2 text-sm text-slate-400">Payouts approved</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">✓</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Total Amount</div>
                <div className="mt-3 text-3xl font-black text-slate-900">₹{totalAmount.toFixed(0)}</div>
                <div className="mt-2 text-sm text-slate-400">All requests combined</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 font-bold">Σ</div>
            </div>
          </div>
        </div>

        {/* Payment Requests Table */}
        <div className="mt-8">
          <AdminPaymentRequestsClient initialRequests={safe} />
        </div>
      </div>
    </main>
  );
}
