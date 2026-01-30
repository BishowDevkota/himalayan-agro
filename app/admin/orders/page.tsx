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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
            <p className="mt-1 text-sm text-slate-600">Manage and fulfill recent orders — search, filter and review details.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/orders" className="inline-flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm text-slate-700">Refresh</a>
          </div>
        </div>

        <div className="mt-6">
          <AdminOrdersClient initialOrders={safe} />
        </div>
      </div>
    </div>
  );
}