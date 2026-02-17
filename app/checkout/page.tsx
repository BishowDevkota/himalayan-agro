import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";

import CheckoutClient from "../components/CheckoutClient";

export default async function CheckoutPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return <div className="p-12">Please sign in to checkout.</div>;

  return (
    <div className="bg-white text-black dark:bg-white dark:text-black min-h-screen">
      <div className="max-w-4xl mx-auto pt-28 pb-12 px-4 text-black dark:text-black">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-6">
          {/* client component handles cart fetch & submit */}
          <CheckoutClient />
        </div>
      </div>
    </div>
  );
}
