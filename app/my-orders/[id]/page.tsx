import React from "react";
import mongoose from "mongoose";
import connectToDatabase from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import CancelOrderButton from "../../components/CancelOrderButton";
import PrintInvoiceButton from "../../components/PrintInvoiceButton";

export default async function MyOrderDetail({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  // `params` can be a Promise in some Next.js runtimes — unwrap it safely.
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return <div className="p-12">Please sign in to view your orders.</div>;

  await connectToDatabase();
  const order = await Order.findById(id).lean();
  if (!order) return <div className="p-12">Order not found</div>;
  // Allow env-based admin (id "admin") to view any order; otherwise check ownership
  const isAdmin = (session.user as any).role === "admin";
  if (!isAdmin && String(order.user) !== String((session.user as any).id)) return <div className="p-12">Unauthorized</div>;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-5xl mx-auto pt-28 pb-16 px-6">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-2xl font-extrabold">Order #{String(order._id).slice(-8)}</h1>
                <div className="mt-2 text-sm text-slate-500">Placed {new Date(order.createdAt).toLocaleString()}</div>
              </div>

              <div className="space-y-2 text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' : order.orderStatus === 'processing' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
                  {order.orderStatus}
                </div>
                <div className="text-sm text-slate-500">Payment: <span className="font-medium text-slate-800">{order.paymentStatus}</span></div>
              </div>
            </div>

            <section className="mt-8 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Items</h2>
              <div className="divide-y divide-gray-100 rounded-lg border">
                {order.items.map((it: any) => (
                  <div key={String(it.product)} className="flex items-center gap-4 p-4">
                    <img src={it.image || '/placeholder.png'} alt={it.name} className="w-20 h-20 rounded-md object-cover border" />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{it.name}</div>
                      <div className="text-sm text-slate-500">{it.brand || ''}{it.category ? ` • ${it.category}` : ''}</div>
                      <div className="mt-2 text-sm text-slate-600">Qty: {it.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-slate-800">${(it.price * it.quantity).toFixed(2)}</div>
                      <div className="text-sm text-slate-500">${it.price.toFixed(2)} each</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-slate-900">Shipping address</h3>
                {order.shippingAddress ? (
                  <address className="mt-3 not-italic text-sm text-slate-600 space-y-1">
                    <div>{order.shippingAddress.name}</div>
                    <div>{order.shippingAddress.line1}</div>
                    <div>{order.shippingAddress.city} {order.shippingAddress.postalCode}</div>
                    <div>Phone: {order.shippingAddress.phone}</div>
                  </address>
                ) : (
                  <div className="mt-3 text-sm text-slate-500">No shipping address provided.</div>
                )}
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-slate-900">Order progress</h3>
                <div className="mt-4">
                  <ol className="flex items-center gap-4 text-sm text-slate-500">
                    <li className={`${['processing','shipped','delivered'].indexOf(order.orderStatus) >= 0 ? 'text-slate-900 font-semibold' : ''}`}>Processing</li>
                    <li className={`flex-1 border-t ${['shipped','delivered'].indexOf(order.orderStatus) >= 0 ? 'border-sky-400' : 'border-gray-100'}`} />
                    <li className={`${['shipped','delivered'].indexOf(order.orderStatus) >= 0 ? 'text-slate-900 font-semibold' : ''}`}>Shipped</li>
                    <li className={`flex-1 border-t ${order.orderStatus === 'delivered' ? 'border-sky-400' : 'border-gray-100'}`} />
                    <li className={`${order.orderStatus === 'delivered' ? 'text-slate-900 font-semibold' : ''}`}>Delivered</li>
                  </ol>
                </div>

                <div className="mt-4 text-sm text-slate-600">Estimated delivery: <span className="font-medium">{order.estimatedDelivery || 'TBD'}</span></div>
              </div>
            </section>
          </div>

          <aside className="w-full md:w-80 sticky top-24 self-start">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Order summary</h3>

              <dl className="mt-4 text-sm text-slate-600 space-y-3">
                <div className="flex items-center justify-between"><dt>Subtotal</dt><dd className="font-medium text-slate-800">${order.subTotal?.toFixed(2) ?? Number(order.totalAmount).toFixed(2)}</dd></div>
                <div className="flex items-center justify-between"><dt>Shipping</dt><dd className="font-medium text-slate-800">${order.shippingCost?.toFixed(2) ?? '0.00'}</dd></div>
                <div className="flex items-center justify-between"><dt>Tax</dt><dd className="font-medium text-slate-800">${order.tax?.toFixed(2) ?? '0.00'}</dd></div>
                <div className="border-t pt-3 flex items-center justify-between"><dt className="text-sm">Total</dt><dd className="text-lg font-extrabold">${order.totalAmount.toFixed(2)}</dd></div>
              </dl>

              <div className="mt-6 space-y-3">
                <CancelOrderButton orderId={String(order._id)} currentStatus={order.orderStatus} />
                <PrintInvoiceButton />
                <a className="block text-center text-sm text-sky-600 hover:underline" href="/contact">Contact support</a>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-400">If you need help with this order, contact support and include the order number.</div>
          </aside>
        </div>

        <div className="mt-8">
          <a className="text-sm text-sky-600" href="/my-orders">← Back to your orders</a>
        </div>
      </div>
    </main>
  );
}