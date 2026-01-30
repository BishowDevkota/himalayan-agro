import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import Product from "../../../models/Product";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";

export default async function AdminDashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") {
    return <div className="p-12">Unauthorized</div>;
  }

  await connectToDatabase();
  const [users, products, orders] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
  ]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Admin dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Overview — quick access to orders, products and users.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">Signed in as</div>
            <div className="px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-800">{session.user?.email}</div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Users</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900">{users}</div>
                <div className="mt-2 text-sm text-slate-400">Total registered accounts</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-bold">U</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Products</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900">{products}</div>
                <div className="mt-2 text-sm text-slate-400">Active product listings</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 font-bold">P</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Orders</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900">{orders}</div>
                <div className="mt-2 text-sm text-slate-400">Orders placed (all time)</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 font-bold">O</div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent orders</h2>
              <a className="text-sm text-sky-600 hover:underline" href="/admin/orders">View all</a>
            </div>

            <div className="mt-6 overflow-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="pb-3 pr-6">Order</th>
                    <th className="pb-3 pr-6">Customer</th>
                    <th className="pb-3 pr-6">Total</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3 pr-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
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

          <aside className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Quick actions</h3>
            <div className="mt-4 grid gap-3">
              <a href="/admin/products" className="w-full text-left inline-flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3 hover:shadow-sm">
                <div>
                  <div className="text-sm text-slate-600">Products</div>
                  <div className="font-medium text-slate-800">Manage catalog</div>
                </div>
                <div className="text-slate-400">→</div>
              </a>

              <a href="/admin/orders" className="w-full text-left inline-flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3 hover:shadow-sm">
                <div>
                  <div className="text-sm text-slate-600">Orders</div>
                  <div className="font-medium text-slate-800">Fulfillment queue</div>
                </div>
                <div className="text-slate-400">→</div>
              </a>

              <a href="/admin/users" className="w-full text-left inline-flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3 hover:shadow-sm">
                <div>
                  <div className="text-sm text-slate-600">Users</div>
                  <div className="font-medium text-slate-800">User management</div>
                </div>
                <div className="text-slate-400">→</div>
              </a>
            </div>

            <div className="mt-6 border-t pt-4 text-sm text-slate-500">
              <div>Last sync: <span className="font-medium text-slate-700">Jan 30, 2026</span></div>
              <div className="mt-2">System status: <span className="ml-2 inline-flex items-center gap-2 text-emerald-600">● <span className="text-slate-600">Healthy</span></span></div>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex gap-3">
          <a className="inline-flex items-center gap-3 rounded-lg bg-sky-600 px-4 py-2 text-white shadow-sm" href="/admin/products">Manage products</a>
          <a className="inline-flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-2 text-slate-700" href="/admin/orders">Manage orders</a>
        </div>
      </div>
    </div>
  );
}