import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import { redirect } from "next/navigation";
import VendorProductForm from "../../../components/vendor/VendorProductForm";

export default async function StoreNewProductPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/products/new");
  if (session.user?.role !== "vendor") return <div className="p-12">Unauthorized</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto pt-28 pb-12 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">New product</h1>
            <p className="mt-1 text-sm text-slate-600">Add a product to your store catalog.</p>
          </div>
        </div>

        <div className="mt-8">
          <VendorProductForm />
        </div>
      </div>
    </div>
  );
}
