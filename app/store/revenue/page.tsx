import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import Distributor from "../../../models/Distributor";
import Product from "../../../models/Product";
import Order from "../../../models/Order";
import PaymentRequest from "../../../models/PaymentRequest";

export default async function StoreRevenuePage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/revenue");
  if (session.user?.role !== "distributor") {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">Unauthorized</div>
      </div>
    );
  }

  await connectToDatabase();
  const distributor = await Distributor.findOne({ user: session.user?.id }).lean();
  if (!distributor) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">Distributor profile missing</div>
      </div>
    );
  }

  const productIds = await Product.find({ distributor: distributor._id }).select("_id").lean();
  const productIdSet = new Set(productIds.map((p: any) => String(p._id)));

  const deliveredOrders = productIdSet.size
    ? await Order.find({ orderStatus: "delivered", "items.product": { $in: Array.from(productIdSet) } }).sort({ createdAt: -1 }).limit(300).lean()
    : [];

  let totalRevenue = 0;
  let totalItems = 0;

  const rows = deliveredOrders.map((o: any) => {
    const vendorItems = (o.items || []).filter((it: any) => productIdSet.has(String(it.product)));
    const vendorTotal = vendorItems.reduce((sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
    const vendorQty = vendorItems.reduce((sum: number, it: any) => sum + Number(it.quantity || 0), 0);
    totalRevenue += vendorTotal;
    totalItems += vendorQty;
    return {
      id: String(o._id),
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
      vendorTotal,
      vendorQty,
    };
  });

  const approvedRequests = await PaymentRequest.find({ distributor: distributor._id, status: "approved" }).lean();
  const realizedRevenue = approvedRequests.reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);
  const unrealizedRevenue = Math.max(0, totalRevenue - realizedRevenue);

  const recentRequests = await PaymentRequest.find({ distributor: distributor._id }).sort({ createdAt: -1 }).limit(10).lean();
  const safeRequests = recentRequests.map((r: any) => ({
    id: String(r._id),
    amount: r.amount,
    status: r.status,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
  }));

  return (
    <main className="pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3">Finance</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Revenue</h1>
            <p className="mt-1 text-sm text-slate-500">Delivered orders only. Revenue updates after delivery confirmation.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors shadow-sm" href="/store/revenue/payment">Request payment</Link>
            <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href="/store">Dashboard</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Delivered orders</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{rows.length}</p>
            <p className="text-xs text-slate-400 mt-3">Counted for payouts</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Items sold</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalItems}</p>
            <p className="text-xs text-slate-400 mt-3">Delivered quantity</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total revenue</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹{totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-3">Gross from line items</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Realized / pending</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹{realizedRevenue.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-3">Pending ₹{unrealizedRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Delivered order revenue</h2>
              <p className="text-xs text-slate-400 mt-0.5">Breakdown of your contribution by delivered order.</p>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm text-slate-800">
                <thead>
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((r: any) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-4 font-semibold text-slate-900">#{String(r.id).slice(-8)}</td>
                      <td className="px-4 py-4 text-slate-600">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</td>
                      <td className="px-4 py-4 text-slate-600">{r.vendorQty}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900">₹{Number(r.vendorTotal || 0).toFixed(2)}</td>
                    </tr>
                  ))}

                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">No delivered orders yet</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Payment requests</h3>
            <div className="mt-4 space-y-3">
              {safeRequests.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm">
                  <div>
                    <div className="font-semibold text-slate-700">₹{Number(r.amount || 0).toFixed(2)}</div>
                    <div className="text-xs text-slate-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === "approved" ? "bg-emerald-50 text-emerald-700" : r.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                    {r.status}
                  </div>
                </div>
              ))}
              {safeRequests.length === 0 ? <div className="text-sm text-slate-500">No requests yet</div> : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
