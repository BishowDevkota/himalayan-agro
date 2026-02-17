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

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
            >
              Refresh
            </a>
          </div>
        </div>

        <div className="mt-6">
          <AdminOrdersClient initialOrders={safe} />
        </div>
      </div>
    </main>
  );
}