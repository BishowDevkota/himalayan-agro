import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import Cart from "../../../models/Cart";
import { getSessionUser, requireUser, requireAdmin } from "../../../lib/server-utils";
import User from "../../../models/User";
import { validateApprovedDistributor, availableDistributorCredit } from "../../../lib/distributor";

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
  const checkoutMode = body.checkoutMode === 'buyNow' ? 'buyNow' : 'cart';
  if (!items.length) return NextResponse.json({ message: "No items" }, { status: 400 });

  await connectToDatabase();
  const distributorCheck = await validateApprovedDistributor(user);
  if (!distributorCheck.ok) {
    return NextResponse.json({ message: distributorCheck.message }, { status: distributorCheck.status });
  }

  const products = await Product.find({ _id: { $in: items.map((item: any) => item.productId) } }).lean();
  const productMap: Record<string, any> = {};
  for (const product of products) productMap[String(product._id)] = product;

  let creditReservedForUserId: string | null = null;
  let creditReservedAmount = 0;

  try {
    let total = 0;
    const orderItems = [];
    for (const it of items) {
      const pid = String(it.productId);
      const qty = Number(it.quantity) || 0;
      const prod = productMap[pid];
      if (!prod || !prod.isActive) throw new Error(`Product ${pid} not available`);

      orderItems.push({
        product: pid,
        name: prod.name,
        quantity: qty,
        price: prod.price,
        image: Array.isArray(prod.images) ? String(prod.images[0] || "") : "",
        brand: prod.brand || "",
        category: prod.category || "",
      });
      total += prod.price * qty;
    }
    const totalRounded = Math.round(total * 100) / 100;

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
      const found = await User.findOne({ email: user.email }).lean();
      if (found && found._id) userIdForOrder = found._id;
      else throw new Error('Unable to resolve user for order');
    }

    // Reserve distributor credit atomically before creating the order.
    const reserved = await User.findOneAndUpdate(
      {
        _id: userIdForOrder,
        role: "distributor",
        distributorStatus: "approved",
        isActive: true,
        $expr: {
          $lte: [
            { $add: [{ $ifNull: ["$creditUsedNpr", 0] }, totalRounded] },
            { $ifNull: ["$creditLimitNpr", 0] },
          ],
        },
      },
      { $inc: { creditUsedNpr: totalRounded } },
      { new: true }
    ).lean();

    if (!reserved) {
      const current = await User.findById(userIdForOrder).lean();
      const available = availableDistributorCredit(current);
      throw new Error(
        `Credit limit exceeded. Available credit: NPR ${available.toFixed(2)}. Please reduce outstanding credit before placing this order.`
      );
    }

    creditReservedForUserId = String(userIdForOrder);
    creditReservedAmount = totalRounded;

    const order = await Order.create({
      user: userIdForOrder,
      items: orderItems,
      totalAmount: totalRounded,
      outlet: (() => {
        const outletIds = Array.from(new Set(products.map((product: any) => String(product.outlet || "")).filter(Boolean)));
        return outletIds.length === 1 ? outletIds[0] : undefined;
      })(),
      distributorCreditApplied: true,
      distributorCreditAmount: totalRounded,
      paymentMethod,
      shippingAddress: shipping,
      paymentStatus: "pending",
      orderStatus: "pending",
      inventoryApplied: false,
    });

    if (checkoutMode !== 'buyNow') {
      await Cart.deleteOne({ user: userIdForOrder });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    if (creditReservedForUserId && creditReservedAmount > 0) {
      await User.findByIdAndUpdate(creditReservedForUserId, {
        $inc: { creditUsedNpr: -Math.abs(creditReservedAmount) },
      });
    }
    return NextResponse.json({ message: err.message || "Order failed" }, { status: 400 });
  }
}