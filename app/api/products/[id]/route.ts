import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import { getSessionUser, requireAdmin } from "../../../../lib/server-utils";

export async function GET(req: Request, context: any) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const { id } = params;
  await connectToDatabase();
  const product = await Product.findById(id).lean();
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: Request, context: any) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const { id } = params;
  const user = await getSessionUser();
  requireAdmin(user);
  const body = await req.json();
  await connectToDatabase();

  const existing = await Product.findById(id).lean();
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const updated = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();
  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });

  // sync category membership if category changed
  try {
    const Category = (await import('../../../../models/Category')).default;
    const oldCatName = existing.category;
    const newCategory = body.category;

    // resolve new category doc (id or name)
    let newCatDoc = null;
    if (newCategory) {
      const asStr = String(newCategory);
      if (/^[0-9a-fA-F]{24}$/.test(asStr)) newCatDoc = await Category.findById(asStr);
      else newCatDoc = await Category.findOne({ name: asStr });
    }

    if (oldCatName && (!newCatDoc || newCatDoc.name !== oldCatName)) {
      // remove from old category.products
      await Category.updateOne({ name: oldCatName }, { $pull: { products: updated._id } });
    }
    if (newCatDoc) {
      // ensure product.category is the category's name and add to products array
      await Product.findByIdAndUpdate(updated._id, { $set: { category: newCatDoc.name } });
      await Category.updateOne({ _id: newCatDoc._id }, { $addToSet: { products: updated._id } });
    }
  } catch (err) {
    console.warn('category sync failed', err);
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, context: any) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const { id } = params;
  const user = await getSessionUser();
  requireAdmin(user);
  await connectToDatabase();
  const deleted = await Product.findByIdAndDelete(id).lean();
  if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });

  // remove product from any category lists
  try {
    const Category = (await import('../../../../models/Category')).default;
    await Category.updateMany({ products: deleted._id }, { $pull: { products: deleted._id } });
  } catch (err) {
    console.warn('failed to remove product from categories', err);
  }

  return NextResponse.json({ success: true });
}