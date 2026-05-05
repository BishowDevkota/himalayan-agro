"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type CheckoutProduct = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  isActive?: boolean;
  stock?: number;
  outlet?: string;
  brand?: string;
  category?: string;
};

type CheckoutCartItem = {
  product: CheckoutProduct;
  quantity: number;
};

type CheckoutCart = {
  items: CheckoutCartItem[];
  checkoutMode?: 'buyNow' | 'cart';
};

type CheckoutUser = {
  role?: string;
  distributorStatus?: string;
  creditLimitNpr?: number;
  creditUsedNpr?: number;
};

export default function CheckoutClient() {
  const [cart, setCart] = useState<CheckoutCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shipping, setShipping] = useState({ name: "", line1: "", city: "", postalCode: "", phone: "" });
  const paymentMethod = "credit";
  const { data: session } = useSession();
  const currentUser = session?.user as CheckoutUser | undefined;
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowProductId = searchParams.get("buyNow");
  const buyNowQtyRaw = Number(searchParams.get("qty") || 1);
  const buyNowQty = Number.isFinite(buyNowQtyRaw) ? Math.max(1, buyNowQtyRaw) : 1;
  const isBuyNow = Boolean(buyNowProductId);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const load = async () => {
      try {
        if (buyNowProductId) {
          const productRes = await fetch(`/api/products/${encodeURIComponent(buyNowProductId)}`);
          const product = (await productRes.json()) as CheckoutProduct & { message?: string };
          if (!productRes.ok || !product?._id) throw new Error(product?.message || 'Unable to load product');
          if (!product.isActive || (product.stock || 0) < 1) throw new Error('Product is not available');

          const qty = Math.min(buyNowQty, Number(product.stock) || buyNowQty);
          if (!mounted) return;
          setCart({ items: [{ product, quantity: qty }], checkoutMode: 'buyNow' });
          return;
        }

        const res = await fetch('/api/cart');
        const data = (await res.json()) as { cart?: CheckoutCart; message?: string };
        if (!res.ok) throw new Error(data?.message || 'Unable to load cart');
        if (!mounted) return;
        setCart(data.cart || { items: [] });
      } catch (err: unknown) {
        if (mounted) {
          setCart({ items: [] });
          const message = err instanceof Error ? err.message : 'Unable to load buy now item';
          if (buyNowProductId) toast.error(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [buyNowProductId, buyNowQty]);

  // Prefer credit payment for approved distributors on Buy Now
  function updateField<K extends keyof typeof shipping>(k: K, v: string) {
    setShipping((s) => ({ ...s, [k]: v }));
  }

  async function placeOrder() {
    if (!shipping.name || !shipping.line1 || !shipping.phone) {
      toast.error('Please provide name, address line 1 and phone for delivery');
      return;
    }

    const currentUser = session?.user as CheckoutUser | undefined;
    const creditLimit = Number(currentUser?.creditLimitNpr || 0);
    const creditUsed = Number(currentUser?.creditUsedNpr || 0);
    const available = Math.max(0, creditLimit - creditUsed);
    if (available < subtotal) {
      toast.error(`Insufficient available credit. Available: NPR ${available.toFixed(2)}`);
      return;
    }

    if (!cart || !cart.items?.length) {
      toast.error('Cart is empty');
      return;
    }

    const items = cart.items.map((it: CheckoutCartItem) => ({ productId: it.product._id, quantity: it.quantity }));
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, paymentMethod, shippingAddress: shipping, checkoutMode: cart.checkoutMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');
      toast.success('Order placed');
      router.push('/my-orders');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to place order';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6 bg-[#f8faf9] border border-gray-100 rounded-2xl">Loading…</div>;
  if (!cart) return <div className="p-6 bg-[#f8faf9] border border-gray-100 rounded-2xl">Unable to load cart.</div>;

  const subtotal = cart.items.reduce((s: number, it: CheckoutCartItem) => s + (it.product?.price || 0) * (it.quantity || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-900">
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Shipping Details</h2>
          <p className="mt-2 text-sm text-gray-600">Enter the address where you would like to receive this order.</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="col-span-2">
              <span className="text-xs text-gray-600">Full name</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
                placeholder="Full name"
                value={shipping.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-xs text-gray-600">Address line 1</span>
              <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" placeholder="Address line 1" value={shipping.line1} onChange={(e) => updateField('line1', e.target.value)} required />
            </label>

            <label>
              <span className="text-xs text-gray-600">City</span>
              <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" placeholder="City" value={shipping.city} onChange={(e) => updateField('city', e.target.value)} />
            </label>

            <label>
              <span className="text-xs text-gray-600">Postal code</span>
              <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" placeholder="Postal code" value={shipping.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
            </label>

            <label className="sm:col-span-2">
              <span className="text-xs text-gray-600">Phone</span>
              <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" placeholder="Phone" value={shipping.phone} onChange={(e) => updateField('phone', e.target.value)} required />
            </label>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Payment</h2>
          <p className="mt-2 text-sm text-gray-600">This checkout uses your approved distributor credit account.</p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-[#059669]/20 bg-[#f8faf9] p-4">
              <div className="font-semibold text-gray-900">Distributor credit</div>
              <p className="text-sm text-gray-600 mt-1">Payment will be charged against your approved distributor credit account.</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm text-gray-700">
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Credit limit</div>
                  <div className="mt-1 font-semibold">NPR {Number(currentUser?.creditLimitNpr || 0).toFixed(2)}</div>
                </div>
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Credit used</div>
                  <div className="mt-1 font-semibold">NPR {Number(currentUser?.creditUsedNpr || 0).toFixed(2)}</div>
                </div>
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Available credit</div>
                  <div className="mt-1 font-semibold">NPR {Math.max(0, Number(currentUser?.creditLimitNpr || 0) - Number(currentUser?.creditUsedNpr || 0)).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Items</h2>
          <div className="mt-4 space-y-4">
            {cart.items.map((it: CheckoutCartItem) => (
              <div key={it.product._id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-[#f8faf9]">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.product.images?.[0] || '/placeholder.png'} alt={it.product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{it.product.name}</div>
                      <div className="text-xs text-gray-600 mt-1">Qty: {it.quantity}</div>
                    </div>

                    <div className="text-sm font-bold text-[#d97706]">₹{(it.product.price * it.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isBuyNow && (
            <div className="mt-6 flex justify-end">
              <button className="rounded-xl border border-[#0891b2]/30 bg-[#0891b2]/10 text-[#0e7490] px-4 py-2 text-sm font-medium hover:bg-[#0891b2]/20 transition-colors" onClick={() => router.push('/cart')}>Edit cart</button>
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <button className="rounded-xl bg-[#059669] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#047857] transition-colors" onClick={placeOrder} disabled={submitting}>{submitting ? 'Placing…' : 'Place order'}</button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 bg-[#f8faf9] border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="text-sm text-gray-500">Order summary</div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">Items <span className="font-medium">{cart.items.length}</span></div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-xs text-gray-500">Subtotal</div>
            <div className="text-2xl font-extrabold text-[#d97706]">₹{subtotal.toFixed(2)}</div>
          </div>

          <div className="mt-2 text-sm text-gray-600">Shipping: Calculated at fulfillment</div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>Payment</div>
              <div className="font-medium text-gray-800">Distributor credit</div>
            </div>

            <div className="mt-4 text-right text-2xl font-bold">Total: ₹{subtotal.toFixed(2)}</div>

            <div className="mt-6">
              <button onClick={placeOrder} disabled={submitting} className="w-full inline-flex items-center justify-center rounded-xl bg-[#059669] text-white py-3 text-sm font-semibold hover:bg-[#047857] transition-colors">{submitting ? 'Placing…' : 'Place order'}</button>
            </div>

            <div className="mt-4 text-sm text-gray-500">Shipping & payment on next step. Free returns • Secure payments</div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="px-3 py-2 bg-white border border-gray-100 rounded">Estimated delivery</div>
              <div className="px-3 py-2 bg-white border border-gray-100 rounded text-right">2–5 business days</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
