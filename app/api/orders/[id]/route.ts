import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { getSessionUser, requireAdmin, requireUser } from "../../../../lib/server-utils";

const ALLOWED_ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
const ALLOWED_PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;

export async function GET(req: Request, context: any) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const { id } = params;
  const user = await getSessionUser();
  await connectToDatabase();
  const order = await Order.findById(id).populate("user", "email name").lean();
  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  // admin can view any order; users can view only their own
  if (user?.role === "admin") return NextResponse.json(order);
  requireUser(user);
  if (String(order.user?._id || order.user) !== String(user.id)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  return NextResponse.json(order);
}

export async function PATCH(req: Request, context: any) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const { id } = params;
  const user = await getSessionUser();
  requireAdmin(user);
  const body = await req.json().catch(() => ({}));
  const updates: any = {};

  if (Object.prototype.hasOwnProperty.call(body, "orderStatus")) {
    if (!ALLOWED_ORDER_STATUSES.includes(body.orderStatus)) {
      return NextResponse.json({ message: "Invalid orderStatus" }, { status: 400 });
    }
    updates.orderStatus = body.orderStatus;
  }
  if (Object.prototype.hasOwnProperty.call(body, "paymentStatus")) {
    if (!ALLOWED_PAYMENT_STATUSES.includes(body.paymentStatus)) {
      return NextResponse.json({ message: "Invalid paymentStatus" }, { status: 400 });
    }
    updates.paymentStatus = body.paymentStatus;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
  }

  await connectToDatabase();
  const updated = await Order.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
  if (!updated) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  // emit webhook / email notification for order status changes (best-effort)
  try {
    const { notifyOrderStatusChange } = await import("../../../../lib/notifications");
    notifyOrderStatusChange(updated).catch(() => undefined);
  } catch (err) {
    console.warn("notifications helper unavailable", err);
  }

  return NextResponse.json(updated);
}