import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import connectToDatabase from "../../../lib/mongodb";
import PaymentRequest from "../../../models/PaymentRequest";
import Distributor from "../../../models/Distributor";
import AdminPaymentRequestsClient from "../../components/admin/AdminPaymentRequestsClient";
import { hasPermission } from "../../../lib/permissions";

export default async function AdminPaymentRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "payments:read")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const requests = await PaymentRequest.find({}).sort({ createdAt: -1 }).lean();
  const vendorIds = requests.map((r: any) => r.distributor);
  const distributors = await Distributor.find({ _id: { $in: vendorIds } }).lean();
  const vendorById = new Map(distributors.map((v: any) => [String(v._id), v]));

  const safe = requests.map((r: any) => {
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

  const pendingCount = safe.filter((r: any) => r.status === "pending").length;
  const approvedCount = safe.filter((r: any) => r.status === "approved").length;
  const rejectedCount = safe.filter((r: any) => r.status === "rejected").length;
  const totalAmount = safe.reduce((sum: number, r: any) => sum + (typeof r.amount === "number" ? r.amount : 0), 0);

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">Finance</span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">Payment Requests</h1>
            <p className="mt-1 text-sm text-slate-500">Review distributor payout requests and approve or reject.</p>
          </div>
          <a href="/admin/payment-requests" className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm self-start">
            Refresh
          </a>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Total Requests</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{safe.length}</div>
                <div className="mt-1 text-xs text-slate-400">All payout requests</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center"><svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Pending</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{pendingCount}</div>
                <div className="mt-1 text-xs text-slate-400">Awaiting action</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center"><svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Approved</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{approvedCount}</div>
                <div className="mt-1 text-xs text-slate-400">Payouts approved</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center"><svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Total Amount</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">₹{totalAmount.toFixed(0)}</div>
                <div className="mt-1 text-xs text-slate-400">All requests combined</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center"><svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
          </div>
        </div>

        {/* Payment Requests Table */}
        <AdminPaymentRequestsClient initialRequests={safe} />
      </div>
    </main>
  );
}
