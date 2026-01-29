import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Category from "../../../../models/Category";
import Product from "../../../../models/Product";
import { getSessionUser, requireAdmin } from "../../../../lib/server-utils";

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  requireAdmin(user);
  const body = await req.json();
  await connectToDatabase();

  const payload: any = {
    name: String(body.name).trim(),
    slug: body.slug ? String(body.slug).trim() : undefined,
    products: Array.isArray(body.products) ? body.products : [],
  };

  const cat = await Category.findOneAndUpdate({ name: payload.name }, { $set: payload }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
  return NextResponse.json(cat, { status: 201 });
}

