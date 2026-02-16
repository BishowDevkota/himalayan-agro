import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import Cart from "../../../models/Cart";
import { getSessionUser, requireUser, requireAdmin } from "../../../lib/server-utils";

export async function GET(req: Request) {
  const user = await getSessionUser();
  await connectToDatabase();

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(100, Number(url.searchParams.get("limit") || 20));

  if (user?.role === "admin") {
    const [items, total] = await Promise.all([
      Order.find({}).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments({}),
    ]);
    return NextResponse.json({ items, meta: { total, page, limit } });
  }

  requireUser(user);
  if (!mongoose.Types.ObjectId.isValid(user.id)) {
    return NextResponse.json({ items: [], meta: { total: 0, page, limit } });
  }
  const [items, total] = await Promise.all([
    Order.find({ user: user.id }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments({ user: user.id }),
  ]);
  return NextResponse.json({ items, meta: { total, page, limit } });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  requireUser(user);
  const body = await req.json();
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return NextResponse.json({ message: "No items" }, { status: 400 });

  await connectToDatabase();

  // load product snapshots and validate stock
  const productIds = items.map((i: any) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap: Record<string, any> = {};
  for (const p of products) productMap[p._id.toString()] = p;

  const opsDone: Array<{ id: string; qty: number }> = [];

  try {
    let total = 0;
    const orderItems = [];
    for (const it of items) {
      const pid = String(it.productId);
      const qty = Number(it.quantity) || 0;
      const prod = productMap[pid];
      if (!prod || !prod.isActive) throw new Error(`Product ${pid} not available`);
      if (prod.stock < qty) throw new Error(`Insufficient stock for ${prod.name}`);

      // atomically decrement stock if enough
      const updated = await Product.findOneAndUpdate(
        { _id: pid, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      ).lean();
      if (!updated) throw new Error(`Unable to reserve stock for ${prod.name}`);
      opsDone.push({ id: pid, qty });

      orderItems.push({ product: pid, name: prod.name, quantity: qty, price: prod.price });
      total += prod.price * qty;
    }

    // accept optional shipping/payment info (for now only COD supported)
    const paymentMethod = body.paymentMethod === 'cod' ? 'cod' : 'cod';
    const shipping = body.shippingAddress && typeof body.shippingAddress === 'object' ? body.shippingAddress : undefined;

    // basic validation for COD: require name and line1 and phone
    if (paymentMethod === 'cod') {
      if (!shipping || !shipping.name || !shipping.line1 || !shipping.phone) {
        throw new Error('Shipping name, address line1 and phone are required for Cash-on-delivery');
      }
    }

    // determine a proper user _id for the order (session user may be a minimal object)
    let userIdForOrder: any = user.id;
    if (!/^[0-9a-fA-F]{24}$/.test(String(userIdForOrder || ""))) {
      // try to resolve by email to a real user _id
      const User = (await import('../../../models/User')).default;
      const found = await User.findOne({ email: user.email }).lean();
      if (found && found._id) userIdForOrder = found._id;
      else throw new Error('Unable to resolve user for order');
    }

    const order = await Order.create({
      user: userIdForOrder,
      items: orderItems,
      totalAmount: Math.round(total * 100) / 100,
      paymentMethod,
      shippingAddress: shipping,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    // clear cart
    await Cart.deleteOne({ user: userIdForOrder });

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    // rollback stock changes
    if (opsDone.length) {
      await Promise.all(
        opsDone.map((o) => Product.findByIdAndUpdate(o.id, { $inc: { stock: o.qty } }))
      );
    }
    return NextResponse.json({ message: err.message || "Order failed" }, { status: 400 });
  }
}