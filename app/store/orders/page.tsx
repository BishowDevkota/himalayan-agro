import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import Vendor from "../../../models/Vendor";
import Product from "../../../models/Product";
import Order from "../../../models/Order";
import VendorOrdersClient from "../../components/vendor/VendorOrdersClient";

export default async function StoreOrdersPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/orders");
  if (session.user?.role !== "vendor") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const vendor = await Vendor.findOne({ user: session.user?.id }).lean();
  if (!vendor) return <div className="p-12">Vendor profile missing</div>;

  const productIds = await Product.find({ vendor: vendor._id }).select("_id").lean();
  const productIdSet = new Set(productIds.map((p: any) => String(p._id)));

  const orders = productIdSet.size
    ? await Order.find({ "items.product": { $in: Array.from(productIdSet) } }).sort({ createdAt: -1 }).limit(200).lean()
    : [];

  const safe = (orders || []).map((o: any) => {
    const vendorItems = (o.items || []).filter((it: any) => productIdSet.has(String(it.product)));
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
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Orders</h1>
            <p className="mt-2 text-sm text-slate-500">Manage orders that include your products.</p>
          </div>
          <a className="rounded border border-gray-200 px-4 py-2 text-sm" href="/store">Back to dashboard</a>
        </div>

        <VendorOrdersClient initialOrders={safe} />
      </div>
    </div>
  );
}
