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
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Admin dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <div className="text-sm text-gray-500">Users</div>
          <div className="mt-2 text-2xl font-bold">{users}</div>
        </div>
        <div className="border rounded-lg p-6">
          <div className="text-sm text-gray-500">Products</div>
          <div className="mt-2 text-2xl font-bold">{products}</div>
        </div>
        <div className="border rounded-lg p-6">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="mt-2 text-2xl font-bold">{orders}</div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <a className="inline-block rounded bg-sky-600 text-white px-4 py-2" href="/admin/products">Manage products</a>
        <a className="inline-block rounded bg-sky-600 text-white px-4 py-2" href="/admin/orders">Manage orders</a>
      </div>
    </div>
  );
}