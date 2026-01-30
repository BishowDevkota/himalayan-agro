"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CheckoutClient() {
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shipping, setShipping] = useState({ name: "", line1: "", city: "", postalCode: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/cart')
      .then((r) => r.json())
      .then((d) => { if (!mounted) return; setCart(d.cart || { items: [] }); })
      .catch(() => setCart({ items: [] }))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  function updateField<K extends keyof typeof shipping>(k: K, v: string) {
    setShipping((s) => ({ ...s, [k]: v }));
  }

  async function placeOrder() {
    // minimal validation for COD
    if (paymentMethod === 'cod') {
      if (!shipping.name || !shipping.line1 || !shipping.phone) {
        toast.error('Please provide name, address line 1 and phone for delivery');
        return;
      }
    }
    if (!cart || !cart.items?.length) {
      toast.error('Cart is empty');
      return;
    }

    const items = cart.items.map((it: any) => ({ productId: it.product._id, quantity: it.quantity }));
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, paymentMethod, shippingAddress: shipping }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');
      toast.success('Order placed');
      router.push('/my-orders');
    } catch (err: any) {
      toast.error(err.message || 'Unable to place order');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!cart) return <div className="p-6">Unable to load cart.</div>;

  const subtotal = (cart.items || []).reduce((s: number, it: any) => s + (it.product?.price || 0) * (it.quantity || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black dark:text-black">
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border p-6 text-black">
          <h2 className="text-lg font-semibold">Shipping</h2>
          <p className="mt-2 text-sm text-black">Enter the address where you'd like to receive this order.</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="col-span-2">
              <span className="text-xs text-black">Full name</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="Full name"
                value={shipping.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-xs text-gray-600">Address line 1</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Address line 1" value={shipping.line1} onChange={(e) => updateField('line1', e.target.value)} required />
            </label>

            <label>
              <span className="text-xs text-gray-600">City</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="City" value={shipping.city} onChange={(e) => updateField('city', e.target.value)} />
            </label>

            <label>
              <span className="text-xs text-gray-600">Postal code</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Postal code" value={shipping.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
            </label>

            <label className="sm:col-span-2">
              <span className="text-xs text-gray-600">Phone</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Phone" value={shipping.phone} onChange={(e) => updateField('phone', e.target.value)} required />
            </label>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold">Payment</h2>
          <p className="mt-2 text-sm text-black">Select a payment method.</p>

          <div className="mt-4 space-y-3">
            <label className="flex items-start gap-3">
              <input className="mt-1" type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <div>
                <div className="font-medium">Cash on delivery</div>
                <div className="text-sm text-black">Pay when the order is delivered</div>
              </div>
            </label>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold">Items</h2>
          <div className="mt-4 space-y-4">
            {(cart.items || []).map((it: any) => (
              <div key={it.product._id} className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.product.images?.[0] || '/placeholder.png'} alt={it.product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{it.product.name}</div>
                      <div className="text-xs text-black mt-1">Qty: {it.quantity}</div>
                    </div>

                    <div className="text-sm font-medium text-black">₹{(it.product.price * it.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button className="rounded-md bg-sky-50 text-sky-700 px-4 py-2 text-sm border border-sky-100" onClick={() => router.push('/cart')}>Edit cart</button>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="rounded bg-sky-600 text-white px-4 py-2" onClick={placeOrder} disabled={submitting}>{submitting ? 'Placing…' : 'Place order'}</button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 bg-white border rounded-xl p-6 shadow-sm">
        <div className="text-sm text-gray-500">Order summary</div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">Items <span className="font-medium">{cart.items.length}</span></div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-xs text-gray-500">Subtotal</div>
            <div className="text-2xl font-extrabold text-sky-600">₹{subtotal.toFixed(2)}</div>
          </div>

          <div className="mt-2 text-sm text-gray-600">Shipping: Calculated at fulfillment</div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>Payment</div>
              <div className="font-medium text-gray-800">{paymentMethod === 'cod' ? 'Cash on delivery' : paymentMethod}</div>
            </div>

            <div className="mt-4 text-right text-2xl font-bold">Total: ₹{subtotal.toFixed(2)}</div>

            <div className="mt-6">
              <button onClick={placeOrder} disabled={submitting} className="w-full inline-flex items-center justify-center rounded-lg bg-sky-600 text-white py-3 text-sm font-medium">{submitting ? 'Placing…' : 'Place order'}</button>
            </div>

            <div className="mt-4 text-sm text-gray-500">Shipping & payment on next step. Free returns • Secure payments</div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="px-3 py-2 bg-gray-50 rounded">Estimated delivery</div>
              <div className="px-3 py-2 bg-gray-50 rounded text-right">2–5 business days</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
