import React from "react";
import mongoose from "mongoose";
import connectToDatabase from "../../lib/mongodb";
import Order from "../../models/Order";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";

import CancelOrderButton from "../components/CancelOrderButton";

export default async function MyOrdersPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return <div className="p-12">Please sign in to view your orders.</div>;

  await connectToDatabase();

  // Guard: env-based admin has id "admin" which is not a valid ObjectId
  const userId = session.user.id;
  const orders = mongoose.Types.ObjectId.isValid(userId)
    ? await Order.find({ user: userId }).sort({ createdAt: -1 }).lean()
    : [];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto pt-28 pb-16 px-6 lg:px-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">My orders</h1>
            <p className="mt-2 text-sm text-slate-500">Recent orders and their current status — track, view details or cancel when eligible.</p>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <a className="inline-flex items-center gap-2 rounded-lg bg-white border px-4 py-2 text-sm shadow-sm" href="/shop">Continue shopping</a>
            <div className="text-sm text-slate-500">{orders.length} orders</div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6">
          {orders.map((o: any) => (
            <article key={String(o._id)} className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12">
                      <div className="text-sm text-slate-500">Order</div>
                      <div className="font-medium">#{String(o._id).slice(-8)}</div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="text-sm text-slate-600">{o.items.length} items</div>
                        <div className="h-4 w-px bg-gray-100" />
                        <div className="text-sm text-slate-600">Placed {new Date(o.createdAt).toLocaleDateString()}</div>
                        <div className="h-4 w-px bg-gray-100" />
                        <div className="text-sm text-slate-600">Payment: <span className="font-medium">{o.paymentStatus}</span></div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${o.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' : o.orderStatus === 'processing' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
                          {o.orderStatus}
                        </span>

                        <div className="text-sm text-slate-500">Total: <span className="font-semibold text-slate-800">${Number(o.totalAmount).toFixed(2)}</span></div>
                      </div>

                      <div className="mt-4 text-sm text-slate-600 line-clamp-2">{o.items.map((it: any) => it.name).slice(0,3).join(' • ')}{o.items.length>3 ? ` • +${o.items.length-3} more` : ''}</div>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-3">
                  <a className="inline-flex items-center gap-2 text-sm text-sky-600 font-medium" href={`/my-orders/${o._id}`}>View details</a>
                  <CancelOrderButton orderId={String(o._id)} currentStatus={o.orderStatus} />
                </div>
              </div>
            </article>
          ))}

          {orders.length === 0 && (
            <div className="py-20 text-center text-sm text-slate-500">You have no orders yet — start shopping to place your first order.</div>
          )}
        </div>
      </div>
    </main>
  );
}