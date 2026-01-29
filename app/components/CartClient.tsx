"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CartClient() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  async function fetchCart() {
    setLoading(true);
    const res = await fetch(`/api/cart`);
    const json = await res.json();
    setCart(json.cart || { items: [] });
    setLoading(false);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function update(productId: string, quantity: number) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Cart update failed");
      toast.success("Cart updated");
      await fetchCart();
    } catch (err: any) {
      toast.error(err.message || "Unable to update cart");
    } finally {
      setUpdating(false);
    }
  }

  async function remove(productId?: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productId ? { productId } : {}),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Remove failed");
      toast.success("Removed");
      await fetchCart();
    } catch (err: any) {
      toast.error(err.message || "Unable to remove item");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="py-12">Loading cart…</div>;
  if (!cart || !cart.items.length)
    return <div className="py-12 text-center">Your cart is empty — browse the <a className="text-sky-600" href="/shop">shop</a>.</div>;

  const total = cart.items.reduce((s: number, it: any) => s + it.product.price * it.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((it: any) => (
          <div key={it.product._id} className="flex items-center gap-4 border rounded p-4">
            <img src={it.product.images?.[0] || '/placeholder.png'} alt={it.product.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{it.product.name}</div>
              <div className="text-sm text-gray-600">${it.product.price.toFixed(2)}</div>
              <div className="mt-2 flex items-center gap-2">
                <input className="w-20 rounded border px-2 py-1" type="number" min={1} value={it.quantity} onChange={(e) => update(it.product._id, Number(e.target.value))} />
                <button className="text-sm text-red-600" onClick={() => remove(it.product._id)}>Remove</button>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${(it.product.price * it.quantity).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex justify-between text-sm text-gray-600">Subtotal <span>${total.toFixed(2)}</span></div>
        <div className="mt-6">
          <a href="/checkout" className="block text-center rounded bg-sky-600 text-white py-2">Proceed to checkout</a>
        </div>
        <div className="mt-4 text-sm text-gray-500">Shipping & payment on next step.</div>
        <div className="mt-4">
          <button className="text-sm text-red-600" onClick={() => remove()}>Clear cart</button>
        </div>
      </div>
    </div>
  );
}