import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import Product from "../../../../models/Product";

async function requireAdmin() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  await connectToDatabase();
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || undefined;
  const category = url.searchParams.get('category') || undefined;
  const page = Math.max(1, Number(url.searchParams.get('page') || 1));
  const perPage = Math.min(200, Number(url.searchParams.get('perPage') || 20));

  const filter: any = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;

  const [items, total] = await Promise.all([
    Product.find(filter).skip((page - 1) * perPage).limit(perPage).lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({ items, meta: { total, page, perPage } });
}

// (Optional) create product via admin API — delegates similar validation as public POST
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  await connectToDatabase();

  const payload: any = {
    name: body.name,
    description: body.description || '',
    brand: body.brand || '',
    price: Number(body.price) || 0,
    category: body.category || 'uncategorized',
    images: Array.isArray(body.images) ? body.images : [],
    stock: Number(body.stock) || 0,
    isActive: body.isActive !== false,
  };

  const product = await Product.create(payload);
  return NextResponse.json(product, { status: 201 });
}
