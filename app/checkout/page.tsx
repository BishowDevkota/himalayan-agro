import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";

import CheckoutClient from "../components/CheckoutClient";

export default async function CheckoutPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return <div className="p-12">Please sign in to checkout.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="mt-6">
        {/* client component handles cart fetch & submit */}
        <CheckoutClient />
      </div>
    </div>
  );
}
