import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import Product from "../../../models/Product";
import Order from "../../../models/Order";
import Vendor from "../../../models/Vendor";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";

export default async function AdminDashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") {
    return <div className="p-12">Unauthorized</div>;
  }

  await connectToDatabase();
  const now = new Date();
  const start30 = new Date(now);
  start30.setDate(now.getDate() - 30);
  const start60 = new Date(now);
  start60.setDate(now.getDate() - 60);
  const start8w = new Date(now);
  start8w.setDate(now.getDate() - 56);

  const [
    users,
    products,
    orders,
    vendors,
    ordersLast8Weeks,
    revenueNowAgg,
    revenuePrevAgg,
    cancelledLast30,
    statusRevenueAgg,
  ] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
    Vendor.countDocuments({}),
    Order.find({ createdAt: { $gte: start8w } }).select("totalAmount createdAt").lean(),
    Order.aggregate([
      { $match: { createdAt: { $gte: start30 } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: start60, $lt: start30 } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: start30 }, orderStatus: "cancelled" }),
    Order.aggregate([
      { $match: { createdAt: { $gte: start30 } } },
      { $group: { _id: "$orderStatus", total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const revenueNow = revenueNowAgg[0]?.total ?? 0;
  const ordersNow = revenueNowAgg[0]?.count ?? 0;
  const revenuePrev = revenuePrevAgg[0]?.total ?? 0;
  const ordersPrev = revenuePrevAgg[0]?.count ?? 0;
  const revenueChange = revenuePrev ? ((revenueNow - revenuePrev) / revenuePrev) * 100 : null;
  const ordersChange = ordersPrev ? ((ordersNow - ordersPrev) / ordersPrev) * 100 : null;
  const avgOrder = ordersNow ? revenueNow / ordersNow : 0;
  const refundRate = ordersNow ? (cancelledLast30 / ordersNow) * 100 : 0;

  const statusPalette = [
    { key: "delivered", label: "Delivered", color: "#0f172a" },
    { key: "shipped", label: "Shipped", color: "#1e293b" },
    { key: "processing", label: "Processing", color: "#334155" },
    { key: "pending", label: "Pending", color: "#64748b" },
    { key: "cancelled", label: "Cancelled", color: "#dc2626" },
  ];

  const statusTotals = statusPalette.map((item) => {
    const match = statusRevenueAgg.find((row: any) => row._id === item.key);
    return { ...item, total: match?.total ?? 0 };
  });

  const statusTotalRevenue = statusTotals.reduce((sum, item) => sum + item.total, 0);
  let cumulative = 0;
  const pieStops = statusTotals
    .filter((item) => item.total > 0)
    .map((item) => {
      const percent = statusTotalRevenue ? (item.total / statusTotalRevenue) * 100 : 0;
      const start = cumulative;
      cumulative += percent;
      return `${item.color} ${start.toFixed(2)}% ${cumulative.toFixed(2)}%`;
    });
  const pieBackground = pieStops.length
    ? `conic-gradient(${pieStops.join(", ")})`
    : "conic-gradient(#e5e7eb 0% 100%)";

  const weekBuckets = Array.from({ length: 8 }, (_, index) => {
    const start = new Date(start8w);
    start.setDate(start8w.getDate() + index * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return { start, end, total: 0, label: `W${index + 1}` };
  });

  ordersLast8Weeks.forEach((order: any) => {
    const createdAt = new Date(order.createdAt);
    const diffDays = Math.floor((createdAt.getTime() - start8w.getTime()) / (1000 * 60 * 60 * 24));
    const index = Math.min(7, Math.max(0, Math.floor(diffDays / 7)));
    weekBuckets[index].total += order.totalAmount ?? 0;
  });

  const maxWeekTotal = Math.max(1, ...weekBuckets.map((bucket) => bucket.total));
  const formatNPR = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  });

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Admin overview</span>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900">Admin dashboard</h1>
            <p className="mt-3 text-sm text-slate-500">
              Overview — quick access to orders, products, categories and users.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Users</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{users}</div>
                <div className="mt-2 text-sm text-slate-400">Total registered accounts</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">U</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Products</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{products}</div>
                <div className="mt-2 text-sm text-slate-400">Active product listings</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">P</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Orders</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{orders}</div>
                <div className="mt-2 text-sm text-slate-400">Orders placed (all time)</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold">O</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Vendors</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{vendors}</div>
                <div className="mt-2 text-sm text-slate-400">Store applications</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">V</div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Revenue mix</h2>
                <p className="mt-1 text-xs text-slate-400">Last 30 days by order status.</p>
              </div>
              <div className="text-xs text-slate-400">Total: {formatNPR.format(revenueNow)}</div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-8 rounded-3xl border border-slate-100 bg-slate-50/80 p-6 md:grid-cols-[260px_1fr]">
              <div className="relative h-60 w-60 mx-auto">
                <div
                  className="h-full w-full rounded-full"
                  style={{ background: pieBackground }}
                />
                <div className="absolute inset-6 rounded-full bg-white shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="text-xs uppercase tracking-widest text-slate-400">Revenue</div>
                  <div className="mt-2 text-xl font-black text-slate-900">{formatNPR.format(revenueNow)}</div>
                  <div className="mt-1 text-xs text-slate-400">Last 30 days</div>
                </div>
              </div>

              <div className="grid gap-4">
                {statusTotals.map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                        <div className="text-xs text-slate-400">{item.key}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">{formatNPR.format(item.total)}</div>
                      <div className="text-xs text-slate-400">
                        {statusTotalRevenue
                          ? `${((item.total / statusTotalRevenue) * 100).toFixed(1)}%`
                          : "0.0%"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Sales performance</h3>
              <span className="text-xs text-slate-400">Last 8 weeks</span>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex h-40 items-end gap-3">
                {weekBuckets.map((bucket, index) => (
                  <div
                    key={`bar-${index}`}
                    className="flex-1 rounded-full bg-linear-to-t from-blue-950 to-blue-700"
                    style={{ height: `${Math.max(18, (bucket.total / maxWeekTotal) * 140)}px` }}
                    title={formatNPR.format(bucket.total)}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-400">
                {weekBuckets.map((bucket) => (
                  <span key={bucket.label}>{bucket.label}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400">Revenue</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{formatNPR.format(revenueNow)}</div>
                <div className={`mt-1 text-xs ${revenueChange === null || revenueChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {revenueChange === null ? "No prior data" : `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}% MoM`}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400">Orders</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{ordersNow}</div>
                <div className={`mt-1 text-xs ${ordersChange === null || ordersChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {ordersChange === null ? "No prior data" : `${ordersChange >= 0 ? "+" : ""}${ordersChange.toFixed(1)}% MoM`}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400">Avg order</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{formatNPR.format(avgOrder)}</div>
                <div className="mt-1 text-xs text-slate-500">Last 30 days</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400">Refunds</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{refundRate.toFixed(1)}%</div>
                <div className="mt-1 text-xs text-slate-500">Cancelled (30 days)</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}