import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import Distributor from "../../../models/Distributor";
import Product from "../../../models/Product";
import Order from "../../../models/Order";
import DistributorOrdersClient from "../../components/distributor/DistributorOrdersClient";

export default async function StoreOrdersPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/orders");
  if (session.user?.role !== "distributor") {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">Unauthorized</div>
      </div>
    );
  }

  await connectToDatabase();
  const distributor = await Distributor.findOne({ user: session.user?.id }).lean();
  if (!distributor) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">Distributor profile missing</div>
      </div>
    );
  }

  const productIds = await Product.find({ distributor: distributor._id }).select("_id").lean();
  const productIdSet = new Set(productIds.map((p: any) => String(p._id)));

  const orders = productIdSet.size
    ? await Order.find({ "items.product": { $in: Array.from(productIdSet) } }).sort({ createdAt: -1 }).limit(200).lean()
    : [];

  const safe = (orders || []).map((o: any) => {
    const vendorItems = (o.items || [])
      .filter((it: any) => productIdSet.has(String(it.product)))
      .map((it: any) => ({
        ...it,
        _id: it._id ? String(it._id) : undefined,
        product: String(it.product),
      }));
    const vendorTotal = vendorItems.reduce((sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
    return {
      _id: String(o._id),
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      shippingAddress: o.shippingAddress,
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
      vendorItems,
      vendorTotal,
    };
  });

  const pendingCount = safe.filter((o: any) => o.orderStatus === "pending").length;
  const processingCount = safe.filter((o: any) => o.orderStatus === "processing").length;
  const deliveredCount = safe.filter((o: any) => o.orderStatus === "delivered").length;
  const totalValue = safe.reduce((sum: number, o: any) => sum + Number(o.vendorTotal || 0), 0);

  return (
    <main className="pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3">Operations</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Orders</h1>
            <p className="mt-1 text-sm text-slate-500">Orders that include products from your catalog.</p>
          </div>
          <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href="/store">Back to dashboard</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{safe.length}</p>
            <p className="text-xs text-slate-400 mt-3">Matched orders</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{pendingCount}</p>
            <p className="text-xs text-slate-400 mt-3">Awaiting processing</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Processing</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{processingCount}</p>
            <p className="text-xs text-slate-400 mt-3">In progress</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Delivered</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{deliveredCount}</p>
            <p className="text-xs text-slate-400 mt-3">Value ₹{totalValue.toFixed(0)}</p>
          </div>
        </div>

        <DistributorOrdersClient initialOrders={safe} />
      </div>
    </main>
  );
}
