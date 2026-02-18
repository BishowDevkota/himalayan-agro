import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import Distributor from "../../../../models/Distributor";
import { getSessionUser, requireVendor } from "../../../../lib/server-utils";

async function getVendorForUser(userId: string) {
  await connectToDatabase();
  return Distributor.findOne({ user: userId }).lean();
}

export async function GET(req: Request) {
  const user = await getSessionUser();
  requireVendor(user);

  const distributor = await getVendorForUser(user.id);
  if (!distributor) return NextResponse.json({ items: [], meta: { total: 0, page: 1, perPage: 20 } });

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || undefined;
  const category = url.searchParams.get("category") || undefined;
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const perPage = Math.min(200, Number(url.searchParams.get("perPage") || 20));

  const filter: any = { distributor: distributor._id };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;

  const [items, total] = await Promise.all([
    Product.find(filter).skip((page - 1) * perPage).limit(perPage).lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({ items, meta: { total, page, perPage } });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  requireVendor(user);
  const body = await req.json();

  const distributor = await getVendorForUser(user.id);
  if (!distributor) return NextResponse.json({ message: "Distributor profile not found" }, { status: 404 });

  const payload = {
    name: body.name,
    description: body.description || "",
    brand: body.brand || "",
    price: Number(body.price) || 0,
    category: body.category || "uncategorized",
    images: Array.isArray(body.images) ? body.images : [],
    stock: Number(body.stock) || 0,
    isActive: body.isActive !== false,
    distributor: distributor._id,
  };

  await connectToDatabase();
  const product = await Product.create(payload);

  try {
    const Category = (await import("../../../../models/Category")).default;
    let categoryDoc = null;
    if (body.category) {
      const catIdLike = String(body.category);
      if (/^[0-9a-fA-F]{24}$/.test(catIdLike)) {
        categoryDoc = await Category.findById(catIdLike);
      } else {
        categoryDoc = await Category.findOne({ name: catIdLike });
      }
    }
    if (categoryDoc) {
      await Product.findByIdAndUpdate(product._id, { $set: { category: categoryDoc.name } });
      await Category.updateOne({ _id: categoryDoc._id }, { $addToSet: { products: product._id } });
    }
  } catch (err) {
    console.warn("category sync failed", err);
  }

  return NextResponse.json(product, { status: 201 });
}
