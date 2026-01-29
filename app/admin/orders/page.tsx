import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";

export default async function AdminOrdersPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(50).lean();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <div className="mt-6 space-y-3">
        {orders.map((o: any) => (
          <div key={o._id} className="border rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Order #{String(o._id).slice(-6)}</div>
                <div className="text-sm text-gray-600">{o.items.length} items • {o.paymentStatus} • {o.orderStatus}</div>
                <div className="text-sm text-gray-500 mt-1">Payment: {o.paymentMethod || 'cod'}{o.shippingAddress?.phone ? ` • ${o.shippingAddress.phone}` : ''}</div>
              </div>
              <div className="text-right text-sm">
                <div>{new Date(o.createdAt).toLocaleString()}</div>
                <div className="mt-2">Total: ${o.totalAmount.toFixed(2)}</div>
                <div className="mt-3">
                  <a className="text-sm text-sky-600" href={`/admin/orders/${o._id}`}>View</a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-sm text-gray-600">No orders yet.</div>}
      </div>
    </div>
  );
}