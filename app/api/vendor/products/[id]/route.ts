import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Product from "../../../../../models/Product";
import Vendor from "../../../../../models/Vendor";
import { getSessionUser, requireVendor } from "../../../../../lib/server-utils";

async function getVendorForUser(userId: string) {
  await connectToDatabase();
  return Vendor.findOne({ user: userId }).lean();
}

async function loadProductForVendor(productId: string, vendorId: string) {
  await connectToDatabase();
  return Product.findOne({ _id: productId, vendor: vendorId }).lean();
}

export async function GET(req: Request, context: any) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const { id } = params;
  const user = await getSessionUser();
  requireVendor(user);

  const vendor = await getVendorForUser(user.id);
  if (!vendor) return NextResponse.json({ message: "Vendor profile not found" }, { status: 404 });

  const product = await loadProductForVendor(id, String(vendor._id));
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: Request, context: any) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const { id } = params;
  const user = await getSessionUser();
  requireVendor(user);
  const body = await req.json();

  const vendor = await getVendorForUser(user.id);
  if (!vendor) return NextResponse.json({ message: "Vendor profile not found" }, { status: 404 });

  const existing = await loadProductForVendor(id, String(vendor._id));
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

  await connectToDatabase();
  const updated = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();
  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    const Category = (await import("../../../../../models/Category")).default;
    const oldCatName = existing.category;
    const newCategory = body.category;

    let newCatDoc = null;
    if (newCategory) {
      const asStr = String(newCategory);
      if (/^[0-9a-fA-F]{24}$/.test(asStr)) newCatDoc = await Category.findById(asStr);
      else newCatDoc = await Category.findOne({ name: asStr });
    }

    if (oldCatName && (!newCatDoc || newCatDoc.name !== oldCatName)) {
      await Category.updateOne({ name: oldCatName }, { $pull: { products: updated._id } });
    }
    if (newCatDoc) {
      await Product.findByIdAndUpdate(updated._id, { $set: { category: newCatDoc.name } });
      await Category.updateOne({ _id: newCatDoc._id }, { $addToSet: { products: updated._id } });
    }
  } catch (err) {
    console.warn("category sync failed", err);
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, context: any) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const { id } = params;
  const user = await getSessionUser();
  requireVendor(user);

  const vendor = await getVendorForUser(user.id);
  if (!vendor) return NextResponse.json({ message: "Vendor profile not found" }, { status: 404 });

  const existing = await loadProductForVendor(id, String(vendor._id));
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

  await connectToDatabase();
  const deleted = await Product.findOneAndDelete({ _id: id, vendor: vendor._id }).lean();
  if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    const Category = (await import("../../../../../models/Category")).default;
    await Category.updateMany({ products: deleted._id }, { $pull: { products: deleted._id } });
  } catch (err) {
    console.warn("failed to remove product from categories", err);
  }

  return NextResponse.json({ success: true });
}
