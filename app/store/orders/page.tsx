import React from "react";
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
  if (session.user?.role !== "distributor") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const distributor = await Distributor.findOne({ user: session.user?.id }).lean();
  if (!distributor) return <div className="p-12">Distributor profile missing</div>;

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

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto pt-28 pb-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Orders</h1>
            <p className="mt-2 text-sm text-slate-500">Manage orders that include your products.</p>
          </div>
          <a className="rounded border border-gray-200 px-4 py-2 text-sm" href="/store">Back to dashboard</a>
        </div>

        <DistributorOrdersClient initialOrders={safe} />
      </div>
    </div>
  );
}
