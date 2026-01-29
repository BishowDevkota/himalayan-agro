import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";

export default async function MyOrderDetail({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  // `params` can be a Promise in some Next.js runtimes — unwrap it safely.
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return <div className="p-12">Please sign in to view your orders.</div>;

  await connectToDatabase();
  const order = await Order.findById(id).lean();
  if (!order) return <div className="p-12">Order not found</div>;
  if (String(order.user) !== String((session.user as any).id)) return <div className="p-12">Unauthorized</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold">Order #{String(order._id).slice(-8)}</h1>
      <div className="mt-4 text-sm text-gray-600">Placed: {new Date(order.createdAt).toLocaleString()}</div>
      <div className="mt-2 text-sm text-gray-600">Status: {order.orderStatus} • Payment: {order.paymentStatus}</div>  <div className="mt-2 text-sm">Payment method: <span className="font-medium">{order.paymentMethod || 'cod'}</span></div>
  {order.shippingAddress && (
    <div className="mt-3 text-sm text-gray-600 space-y-1">
      <div>{order.shippingAddress.name}</div>
      <div>{order.shippingAddress.line1}</div>
      <div>{order.shippingAddress.city} {order.shippingAddress.postalCode}</div>
      <div>Phone: {order.shippingAddress.phone}</div>
    </div>
  )}
      <div className="mt-6 space-y-4">
        {order.items.map((it: any) => (
          <div key={String(it.product)} className="flex items-center gap-4 border rounded p-3">
            <div className="flex-1">
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-gray-600">Qty: {it.quantity} • ${it.price.toFixed(2)}</div>
            </div>
            <div className="text-right">${(it.price * it.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-right text-lg font-bold">Total: ${order.totalAmount.toFixed(2)}</div>
      </div>

      <div className="mt-6">
        <a className="text-sm text-sky-600" href="/my-orders">← Back to your orders</a>
      </div>
    </div>
  );
}