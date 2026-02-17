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
  const [users, products, orders, vendors] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
    Vendor.countDocuments({}),
  ]);

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

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">Signed in as</div>
            <div className="px-4 py-2 rounded-full bg-white border border-slate-100 text-sm font-medium text-slate-800">
              {session.user?.email}
            </div>
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent orders</h2>
              <a className="text-sm text-sky-600 hover:underline" href="/admin/orders">View all</a>
            </div>

            <div className="mt-6 overflow-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pr-6">Order</th>
                    <th className="pb-3 pr-6">Customer</th>
                    <th className="pb-3 pr-6">Total</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3 pr-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* lightweight placeholder rows — data-driven UI remains intact */}
                  <tr>
                    <td className="py-4 pr-6 font-medium text-slate-800">#1001</td>
                    <td className="py-4 pr-6 text-slate-600">Anita T.</td>
                    <td className="py-4 pr-6 text-slate-800">$129.00</td>
                    <td className="py-4 pr-6 text-sm text-emerald-600">Fulfilled</td>
                    <td className="py-4 pr-6 text-slate-500">Jan 24, 2026</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-medium text-slate-800">#1000</td>
                    <td className="py-4 pr-6 text-slate-600">Rajan G.</td>
                    <td className="py-4 pr-6 text-slate-800">$79.00</td>
                    <td className="py-4 pr-6 text-sm text-amber-600">Processing</td>
                    <td className="py-4 pr-6 text-slate-500">Jan 20, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <aside className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Sales performance</h3>
              <span className="text-xs text-slate-400">Last 8 weeks</span>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex h-40 items-end gap-3">
                {[
                  "h-16",
                  "h-20",
                  "h-24",
                  "h-28",
                  "h-24",
                  "h-32",
                  "h-28",
                  "h-36",
                ].map((height, index) => (
                  <div
                    key={`bar-${index}`}
                    className={`flex-1 rounded-full bg-gradient-to-t from-slate-900 to-slate-700 ${height}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-400">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
                <span>W6</span>
                <span>W7</span>
                <span>W8</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400">Revenue</div>
                <div className="mt-2 text-2xl font-black text-slate-900">NPR 42.8M</div>
                <div className="mt-1 text-xs text-emerald-600">+12.4% MoM</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400">Orders</div>
                <div className="mt-2 text-2xl font-black text-slate-900">6,420</div>
                <div className="mt-1 text-xs text-emerald-600">+8.1% MoM</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400">Avg order</div>
                <div className="mt-2 text-2xl font-black text-slate-900">NPR 6,670</div>
                <div className="mt-1 text-xs text-slate-500">Stable</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400">Refunds</div>
                <div className="mt-2 text-2xl font-black text-slate-900">1.2%</div>
                <div className="mt-1 text-xs text-emerald-600">-0.4% MoM</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}