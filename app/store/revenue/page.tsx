import React from "react";
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
  if (session.user?.role !== "distributor") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const distributor = await Distributor.findOne({ user: session.user?.id }).lean();
  if (!distributor) return <div className="p-12">Distributor profile missing</div>;

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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto pt-28 pb-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Revenue</h1>
            <p className="mt-2 text-sm text-slate-500">Delivered orders only — revenue updates after delivery.</p>
          </div>
          <div className="flex items-center gap-3">
            <a className="rounded bg-emerald-600 text-white px-4 py-2 text-sm" href="/store/revenue/payment">Request payment</a>
            <a className="rounded border border-gray-200 px-4 py-2 text-sm" href="/store">Back to dashboard</a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-slate-500">Delivered orders</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{rows.length}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-slate-500">Items sold</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{totalItems}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-slate-500">Total revenue</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">₹{totalRevenue.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-slate-500">Realized / unrealized</div>
            <div className="mt-2 text-lg font-extrabold text-slate-900">₹{realizedRevenue.toFixed(2)}</div>
            <div className="text-xs text-slate-500">Unrealized ₹{unrealizedRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <section className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-auto">
            <table className="w-full text-sm text-slate-800">
              <thead>
                <tr className="text-left text-xs text-slate-600">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r: any) => (
                  <tr key={r.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">#{String(r.id).slice(-8)}</td>
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
          </section>

          <aside className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Payment requests</h3>
            <div className="mt-4 space-y-3">
              {safeRequests.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-slate-700">₹{Number(r.amount || 0).toFixed(2)}</div>
                    <div className="text-xs text-slate-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${r.status === "approved" ? "bg-emerald-50 text-emerald-700" : r.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                    {r.status}
                  </div>
                </div>
              ))}
              {safeRequests.length === 0 ? (
                <div className="text-sm text-slate-500">No requests yet</div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
