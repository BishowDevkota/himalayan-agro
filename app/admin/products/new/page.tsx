import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import ProductForm from "../../../components/admin/ProductForm";

export default async function NewProductPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New product</h1>
      </div>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}