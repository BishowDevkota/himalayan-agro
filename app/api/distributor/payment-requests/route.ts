import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Distributor from "../../../../models/Distributor";
import Product from "../../../../models/Product";
import Order from "../../../../models/Order";
import PaymentRequest from "../../../../models/PaymentRequest";
import { getSessionUser, requireVendor } from "../../../../lib/server-utils";

export async function POST(req: Request) {
  const user = await getSessionUser();
  requireVendor(user);

  const body = await req.json().catch(() => ({}));
  const amount = Number(body.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: "Valid amount is required" }, { status: 400 });
  }

  await connectToDatabase();
  const distributor = await Distributor.findOne({ user: user.id }).lean();
  if (!distributor) return NextResponse.json({ message: "Distributor profile not found" }, { status: 404 });

  const productIds = await Product.find({ distributor: distributor._id }).select("_id").lean();
  const productIdSet = new Set(productIds.map((p: any) => String(p._id)));
  if (productIdSet.size === 0) {
    return NextResponse.json({ message: "No delivered revenue available" }, { status: 400 });
  }

  const deliveredOrders = await Order.find({ orderStatus: "delivered", "items.product": { $in: Array.from(productIdSet) } }).lean();
  const totalDelivered = deliveredOrders.reduce((sum: number, o: any) => {
    const vendorItems = (o.items || []).filter((it: any) => productIdSet.has(String(it.product)));
    const vendorTotal = vendorItems.reduce((s: number, it: any) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    return sum + vendorTotal;
  }, 0);

  const approvedRequests = await PaymentRequest.find({ distributor: distributor._id, status: "approved" }).lean();
  const realized = approvedRequests.reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);
  const unrealized = Math.max(0, totalDelivered - realized);

  if (amount > unrealized) {
    return NextResponse.json({ message: "Request exceeds unrealized revenue" }, { status: 400 });
  }

  const pr = await PaymentRequest.create({ distributor: distributor._id, user: user.id, amount, status: "pending" });
  return NextResponse.json({ id: pr._id.toString(), message: "Payment request submitted" }, { status: 201 });
}
