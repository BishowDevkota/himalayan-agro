import React from "react";
import connectToDatabase from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";

import AdminOrderActions from "../../../components/admin/AdminOrderActions";

export default async function AdminOrderDetail({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  // `params` can be a Promise in some Next.js runtimes — unwrap safely.
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12 bg-white text-slate-900 rounded-3xl shadow-sm">Unauthorized</div>;

  await connectToDatabase();
  const order = await Order.findById(id).populate("user", "email name").lean();
  if (!order) return <div className="p-12 bg-white text-slate-900 rounded-3xl shadow-sm">Order not found</div>;

  return (
    <main className="pb-16">
      <div className="max-w-5xl mx-auto py-16 px-6 lg:px-8">
        <div className="bg-white/90 text-slate-900 border border-slate-100 rounded-3xl shadow-sm p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Order detail</span>
                  <h1 className="mt-3 text-3xl font-black text-slate-900">Order #{String(order._id).slice(-8)}</h1>
                  <div className="text-sm text-slate-600">{order.items.length} items • {order.paymentStatus} • {order.orderStatus}</div>
                  <div className="text-sm text-slate-500 mt-2">Customer: {(order.user as any)?.name || (order.user as any)?.email}</div>
                  <div className="mt-2 text-sm">Payment method: <span className="font-medium">{order.paymentMethod || 'cod'}</span></div>
                  {order.shippingAddress && (
                    <div className="mt-2 text-sm text-slate-600">
                      <div>{order.shippingAddress.name}</div>
                      <div>{order.shippingAddress.line1}</div>
                      <div>{order.shippingAddress.city} {order.shippingAddress.postalCode}</div>
                      <div>Phone: {order.shippingAddress.phone}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {order.items.map((it: any) => (
                  <div key={String(it.product)} className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-3 text-slate-900">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{it.name}</div>
                      <div className="text-sm text-slate-600">Qty: {it.quantity} • ${it.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right text-slate-900">${(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="w-80 bg-white text-slate-900">
              <AdminOrderActions orderId={String(order._id)} initialOrderStatus={order.orderStatus} initialPaymentStatus={order.paymentStatus} />
            </aside>
          </div>

          <div className="mt-6">
            <a className="text-sm text-slate-700" href="/admin/orders">← Back to orders</a>
          </div>
        </div>
      </div>
    </main>
  );
}