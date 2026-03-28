import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../../lib/mongodb";
import Distributor from "../../../../models/Distributor";
import Product from "../../../../models/Product";
import Order from "../../../../models/Order";
import PaymentRequest from "../../../../models/PaymentRequest";
import PaymentRequestForm from "../../../components/distributor/PaymentRequestForm";

export default async function StoreRevenuePaymentPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/revenue/payment");
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

  const deliveredOrders = productIdSet.size
    ? await Order.find({ orderStatus: "delivered", "items.product": { $in: Array.from(productIdSet) } }).lean()
    : [];

  const deliveredTotal = deliveredOrders.reduce((sum: number, o: any) => {
    const vendorItems = (o.items || []).filter((it: any) => productIdSet.has(String(it.product)));
    const vendorTotal = vendorItems.reduce((s: number, it: any) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    return sum + vendorTotal;
  }, 0);

  const approvedRequests = await PaymentRequest.find({ distributor: distributor._id, status: "approved" }).lean();
  const realized = approvedRequests.reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);
  const unrealized = Math.max(0, deliveredTotal - realized);

  return (
    <main className="pb-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3">Payout</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Request payment</h1>
            <p className="mt-1 text-sm text-slate-500">You can request up to your unrealized revenue.</p>
          </div>
          <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href="/store/revenue">Back to revenue</Link>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <PaymentRequestForm maxAmount={unrealized} />
        </div>
      </div>
    </main>
  );
}
