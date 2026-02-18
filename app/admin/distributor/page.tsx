import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import AdminDistributorsClient from "../../components/admin/AdminDistributorsClient";
import connectToDatabase from "../../../lib/mongodb";
import Distributor from "../../../models/Distributor";
import User from "../../../models/User";
import { hasPermission } from "../../../lib/permissions";

export default async function AdminDistributorsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "distributors:read")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const distributors = await Distributor.find({}).sort({ createdAt: -1 }).lean();
  const userIds = distributors.map((v: any) => v.user);
  const users = await User.find({ _id: { $in: userIds } }).select("email isActive role").lean();
  const userById = new Map(users.map((u: any) => [String(u._id), u]));

  const safe = distributors.map((v: any) => {
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

  const pendingCount = safe.filter((v: any) => v.status === "pending").length;
  const approvedCount = safe.filter((v: any) => v.status === "approved").length;
  const rejectedCount = safe.filter((v: any) => v.status === "rejected").length;

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">Partners</span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">Distributor Requests</h1>
            <p className="mt-1 text-sm text-slate-500">Review distributor applications and approve or reject them.</p>
          </div>
          <a href="/admin/distributor" className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm self-start">
            Refresh
          </a>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Total Distributors</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{safe.length}</div>
                <div className="mt-1 text-xs text-slate-400">All applications</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center"><svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Pending</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{pendingCount}</div>
                <div className="mt-1 text-xs text-slate-400">Awaiting review</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center"><svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Approved</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{approvedCount}</div>
                <div className="mt-1 text-xs text-slate-400">Active distributors</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center"><svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Rejected</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{rejectedCount}</div>
                <div className="mt-1 text-xs text-slate-400">Declined applications</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center"><svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
          </div>
        </div>

        {/* Distributors Table */}
        <AdminDistributorsClient initialVendors={safe} />
      </div>
    </main>
  );
}
