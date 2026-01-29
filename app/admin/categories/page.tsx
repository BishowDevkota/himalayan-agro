import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Category from "../../../models/Category";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { serializeMany } from "../../../lib/serialize";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoryRow from "../../components/admin/CategoryRow";

export default async function AdminCategoriesPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const categories = await Category.find().sort({ name: 1 }).lean();
  const safe = serializeMany(categories as any[]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium">Create category</h2>
          <div className="mt-4">
            <CategoryForm />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium">Existing categories</h2>
          <div className="mt-4 space-y-2">
            {safe.map((c: any) => (
              <CategoryRow key={c._id} category={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
