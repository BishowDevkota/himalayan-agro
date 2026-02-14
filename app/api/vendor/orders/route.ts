import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import Product from "../../../../models/Product";
import Vendor from "../../../../models/Vendor";
import { getSessionUser, requireVendor } from "../../../../lib/server-utils";

export async function GET(req: Request) {
  const user = await getSessionUser();
  requireVendor(user);

  await connectToDatabase();
  const vendor = await Vendor.findOne({ user: user.id }).lean();
  if (!vendor) return NextResponse.json({ items: [], meta: { total: 0, page: 1, perPage: 20 } });

  const productIds = await Product.find({ vendor: vendor._id }).select("_id").lean();
  const productIdSet = new Set(productIds.map((p: any) => String(p._id)));
  if (productIdSet.size === 0) return NextResponse.json({ items: [], meta: { total: 0, page: 1, perPage: 20 } });

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const perPage = Math.min(200, Number(url.searchParams.get("perPage") || 20));

  const [items, total] = await Promise.all([
    Order.find({ "items.product": { $in: Array.from(productIdSet) } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
    Order.countDocuments({ "items.product": { $in: Array.from(productIdSet) } }),
  ]);

  const shaped = (items || []).map((o: any) => {
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

  return NextResponse.json({ items: shaped, meta: { total, page, perPage } });
}
