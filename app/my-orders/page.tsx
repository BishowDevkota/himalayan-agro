import React from "react";
import connectToDatabase from "../../lib/mongodb";
import Order from "../../models/Order";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";

import CancelOrderButton from "../components/CancelOrderButton";

export default async function MyOrdersPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return <div className="p-12">Please sign in to view your orders.</div>;

  await connectToDatabase();
  const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">My orders</h1>
      <div className="space-y-4">
        {orders.map((o: any) => (
          <div key={o._id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{String(o._id).slice(-8)}</div>
              <div className="text-sm text-gray-600">{o.items.length} items • {o.paymentStatus} • {o.orderStatus}</div>
              <div className="text-sm text-gray-500">Placed: {new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <a className="text-sm text-sky-600" href={`/my-orders/${o._id}`}>View</a>
              <div>
                <CancelOrderButton orderId={String(o._id)} currentStatus={o.orderStatus} />
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-sm text-gray-600">You have no orders yet.</div>}
      </div>
    </div>
  );
}