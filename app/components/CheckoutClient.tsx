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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="border rounded p-4">
          <h2 className="text-lg font-medium">Shipping</h2>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <input className="rounded border px-3 py-2" placeholder="Full name" value={shipping.name} onChange={(e) => updateField('name', e.target.value)} />
            <input className="rounded border px-3 py-2" placeholder="Address line 1" value={shipping.line1} onChange={(e) => updateField('line1', e.target.value)} />
            <input className="rounded border px-3 py-2" placeholder="City" value={shipping.city} onChange={(e) => updateField('city', e.target.value)} />
            <input className="rounded border px-3 py-2" placeholder="Postal code" value={shipping.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
            <input className="rounded border px-3 py-2" placeholder="Phone" value={shipping.phone} onChange={(e) => updateField('phone', e.target.value)} />
          </div>
        </div>

        <div className="border rounded p-4">
          <h2 className="text-lg font-medium">Payment</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <div>
                <div className="font-medium">Cash on delivery</div>
                <div className="text-sm text-gray-600">Pay when the order is delivered</div>
              </div>
            </label>
            {/* placeholder for future methods */}
          </div>
        </div>

        <div className="border rounded p-4">
          <h2 className="text-lg font-medium">Items</h2>
          <div className="mt-4 space-y-3">
            {(cart.items || []).map((it: any) => (
              <div key={it.product._id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{it.product.name}</div>
                  <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
                </div>
                <div className="font-medium">${(it.product.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="rounded bg-sky-600 text-white px-4 py-2" onClick={placeOrder} disabled={submitting}>{submitting ? 'Placing…' : 'Place order (COD)'}</button>
        </div>
      </div>

      <aside className="border rounded p-4">
        <div className="text-sm text-gray-600">Order summary</div>
        <div className="mt-4 text-lg font-bold">Subtotal: ${subtotal.toFixed(2)}</div>
        <div className="mt-2 text-sm text-gray-600">Shipping: Calculated at fulfillment</div>
        <div className="mt-4 text-right text-2xl font-bold">Total: ${subtotal.toFixed(2)}</div>
      </aside>
    </div>
  );
}
