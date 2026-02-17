import React from "react";
import connectToDatabase from "../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";
import CartClient from "../components/CartClient";

export default async function CartPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) {
    // rely on middleware too, but present a friendly message
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <h2 className="text-xl font-semibold">Please sign in</h2>
        <p className="mt-4">You must be signed in to view your cart.</p>
      </div>
    );
  }

  await connectToDatabase();
  return (
    <div className="bg-white text-black dark:bg-white dark:text-black min-h-screen">
      <div className="max-w-5xl mx-auto pt-28 pb-12 px-4 text-black dark:text-black">
        <h1 className="text-2xl font-semibold mb-6">Your cart</h1>
        <CartClient />
      </div>
    </div>
  );
}