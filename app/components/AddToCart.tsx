"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AddToCart({ product }: { product: any }) {
  const [qty, setQty] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  const disabled = product.stock < 1;

  async function add() {
    if (!session) return signIn(undefined, { callbackUrl: `/product/${product._id}` });
    try {
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to add");
      toast.success("Added to cart");
      // refresh current route to update any server-component cart counts
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Unable to add to cart");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm">Quantity</label>
        <input
          type="number"
          min={1}
          max={product.stock}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          className="w-20 rounded-md border px-2 py-1"
        />
      </div>
      <div className="flex gap-3">
        <button className="rounded-md bg-sky-600 text-white px-4 py-2 disabled:opacity-60" onClick={add} disabled={disabled}>
          Add to cart
        </button>
        <button className="rounded-md border px-4 py-2" onClick={() => router.push("/checkout")}>
          Buy now
        </button>
      </div>
    </div>
  );
}