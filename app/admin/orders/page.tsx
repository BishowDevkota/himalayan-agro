import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import AdminOrdersClient from "../../components/admin/AdminOrdersClient";
import { serializeMany } from "../../../lib/serialize";

export default async function AdminOrdersPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(200).lean();
  const safe = serializeMany(orders as any[]);

  const totalRevenue = safe.reduce((sum: number, o: any) => sum + (typeof o.totalAmount === 'number' ? o.totalAmount : 0), 0);
  const pendingCount = safe.filter((o: any) => o.orderStatus === 'pending').length;
  const processingCount = safe.filter((o: any) => o.orderStatus === 'processing').length;
  const deliveredCount = safe.filter((o: any) => o.orderStatus === 'delivered').length;

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Operations</span>
            <h1 className="mt-3 text-4xl font-black text-slate-900">Orders</h1>
            <p className="mt-3 text-sm text-slate-500">
              Manage and fulfill recent orders — search, filter and review details.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/orders"
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
                <div className="text-xs uppercase tracking-widest text-slate-400">Total Orders</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{safe.length}</div>
                <div className="mt-2 text-sm text-slate-400">All time orders</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">O</div>
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
                <div className="text-xs uppercase tracking-widest text-slate-400">Processing</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{processingCount}</div>
                <div className="mt-2 text-sm text-slate-400">In progress</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">W</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Delivered</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{deliveredCount}</div>
                <div className="mt-2 text-sm text-slate-400">Successfully fulfilled</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">D</div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="mt-8">
          <AdminOrdersClient initialOrders={safe} />
        </div>
      </div>
    </main>
  );
}