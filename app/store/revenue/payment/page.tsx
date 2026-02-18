import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../../lib/mongodb";
import Distributer from "../../../../models/Distributer";
import Product from "../../../../models/Product";
import Order from "../../../../models/Order";
import PaymentRequest from "../../../../models/PaymentRequest";
import PaymentRequestForm from "../../../components/distributer/PaymentRequestForm";

export default async function StoreRevenuePaymentPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/revenue/payment");
  if (session.user?.role !== "distributer") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const distributer = await Distributer.findOne({ user: session.user?.id }).lean();
  if (!distributer) return <div className="p-12">Distributer profile missing</div>;

  const productIds = await Product.find({ distributer: distributer._id }).select("_id").lean();
  const productIdSet = new Set(productIds.map((p: any) => String(p._id)));

  const deliveredOrders = productIdSet.size
    ? await Order.find({ orderStatus: "delivered", "items.product": { $in: Array.from(productIdSet) } }).lean()
    : [];

  const deliveredTotal = deliveredOrders.reduce((sum: number, o: any) => {
    const vendorItems = (o.items || []).filter((it: any) => productIdSet.has(String(it.product)));
    const vendorTotal = vendorItems.reduce((s: number, it: any) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    return sum + vendorTotal;
  }, 0);

  const approvedRequests = await PaymentRequest.find({ distributer: distributer._id, status: "approved" }).lean();
  const realized = approvedRequests.reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);
  const unrealized = Math.max(0, deliveredTotal - realized);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-4xl mx-auto pt-28 pb-16 px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Request payment</h1>
            <p className="mt-2 text-sm text-slate-500">You can request up to your unrealized revenue.</p>
          </div>
          <a className="rounded border border-gray-200 px-4 py-2 text-sm" href="/store/revenue">Back to revenue</a>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <PaymentRequestForm maxAmount={unrealized} />
        </div>
      </div>
    </div>
  );
}
