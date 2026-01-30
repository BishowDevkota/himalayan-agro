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
    return (
      <div className="py-12 text-center">
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <p className="mt-3">Browse the <a className="text-sky-600" href="/shop">shop</a> and add items to your cart.</p>
      </div>
    );

  const total = cart.items.reduce((s: number, it: any) => s + it.product.price * it.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black dark:text-black">
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((it: any) => (
          <article key={it.product._id} className="group bg-white border rounded-2xl shadow-sm overflow-hidden p-4 flex items-start gap-4">
            <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.product.images?.[0] || '/placeholder.png'} alt={it.product.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{it.product.name}</div>
                  <div className="mt-1 text-xs text-gray-500">{it.product.brand || ''}{it.product.category ? ` • ${it.product.category}` : ''}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-sky-600">₹{it.product.price.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-1">₹{(it.product.price * it.quantity).toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    aria-label={`Decrease quantity for ${it.product.name}`}
                    className="w-8 h-8 rounded-md border text-gray-700 disabled:opacity-50"
                    onClick={() => update(it.product._id, Math.max(1, it.quantity - 1))}
                    disabled={updating || it.quantity <= 1}
                  >−</button>
                  <input
                    className="w-20 rounded-md border px-2 py-1 text-sm text-center"
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) => update(it.product._id, Math.max(1, Number(e.target.value) || 1))}
                  />
                  <button
                    aria-label={`Increase quantity for ${it.product.name}`}
                    className="w-8 h-8 rounded-md border text-gray-700 disabled:opacity-50"
                    onClick={() => update(it.product._id, Math.min((it.product.stock || 9999), it.quantity + 1))}
                    disabled={updating || it.quantity >= (it.product.stock || 9999)}
                  >+</button>
                  <div className="text-xs text-gray-500 ml-3">{it.product.stock > 0 ? `${it.product.stock} available` : 'Out of stock'}</div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="text-sm text-black hover:underline" onClick={() => remove(it.product._id)} disabled={updating}>Remove</button>
                  <a href={`/product/${it.product._id}`} className="text-sm text-black hover:underline">View details</a>
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-black">Need to change something? <a className="text-sky-600" href="/shop">Continue shopping</a></div>
          <div>
            <button className="text-sm text-black hover:underline" onClick={() => remove()} disabled={updating}>Clear cart</button>
          </div>
        </div>
      </div>

      <aside className="border rounded-xl p-6 bg-white shadow-sm lg:sticky lg:top-24">
        <div className="text-sm text-gray-500">Subtotal</div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-xs text-gray-500">Items ({cart.items.length})</div>
          <div className="text-2xl font-extrabold text-sky-600">₹{total.toFixed(2)}</div>
        </div>

        <div className="mt-6">
          <a href="/checkout" className="block w-full text-center rounded-lg bg-sky-600 text-white py-3 text-sm font-medium">Proceed to checkout</a>
        </div>

        <div className="mt-4 text-sm text-gray-500">Shipping & payment on next step. Free returns • Secure payments</div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="px-3 py-2 bg-gray-50 rounded">Estimated delivery</div>
          <div className="px-3 py-2 bg-gray-50 rounded text-right">2–5 business days</div>
        </div>
      </aside>
    </div>
  );
}