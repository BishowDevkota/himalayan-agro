import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { getSessionUser } from "../../../../lib/server-utils";
import { filterOrdersForOutlet } from "../../../../lib/order-access";

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== "outlet-admin" && user.role !== "employee")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  // Employees need orders:read permission
  if (user.role === "employee") {
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    if (!permissions.includes("orders:read")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
  }

  if (!user.outletId) {
    return NextResponse.json({ message: "No outlet associated" }, { status: 400 });
  }

  await connectToDatabase();
  const orders = await Order.find({})
    .populate("user", "email name")
    .sort({ createdAt: -1 })
    .lean();

  const outletOrders = await filterOrdersForOutlet(orders, String(user.outletId));
  const safe = outletOrders.map((o: any) => ({
    _id: String(o._id),
    user: o.user,
    items: o.items || [],
    totalAmount: o.totalAmount,
    orderStatus: o.orderStatus,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }));

  return NextResponse.json(safe);
}
