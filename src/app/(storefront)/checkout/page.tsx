'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { buildWhatsAppOrderUrl } from '@/lib/whatsapp';

const SL_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    district: 'Kurunegala',
    postalCode: '',
    orderNotes: '',
    paymentMethod: 'COD' as 'COD' | 'BANK_TRANSFER' | 'PAYHERE',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [idempotencyKey] = useState(() => `YP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const subtotal = getSubtotal();
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 3500 ? 0 : 350;
  const total = subtotal + deliveryFee;

  const waOrderUrl = buildWhatsAppOrderUrl({
    items: items.map((i) => ({
      name: i.name,
      netWeight: i.netWeight,
      quantity: i.quantity,
      priceLkr: i.priceLkr,
    })),
    subtotalLkr: subtotal,
    deliveryFeeLkr: deliveryFee,
    customer: {
      name: form.customerName,
      phone: form.customerPhone,
      address: form.shippingAddress,
      city: form.city,
      district: form.district,
    },
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          idempotencyKey,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      clearCart();
      router.push(`/checkout/success?order=${data.order.orderNumber}&pm=${form.paymentMethod}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-3xl text-forest">Your basket is empty</h1>
        <p className="text-sm text-botanicalText/75">
          Add your favorite Ceylon herbal teas or powders before checking out.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-forest text-ivory px-6 py-3 rounded-full text-sm font-semibold"
        >
          Return to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs font-semibold text-forest mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-forest mb-8">
        Secure Islandwide Checkout
      </h1>

      <form onSubmit={handleCheckout} className="grid lg:grid-cols-12 gap-10">
        {/* Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6 bg-ivory-light p-6 sm:p-8 rounded-3xl border border-sage/20">
          <h2 className="font-serif text-xl font-semibold text-forest">
            1. Delivery Details (Sri Lanka)
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-botanicalText mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full bg-white border border-sage/30 rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-botanicalText mb-1.5">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="076 764 4654"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="w-full bg-white border border-sage/30 rounded-xl px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-botanicalText mb-1.5">
              Email Address (for order confirmation) *
            </label>
            <input
              type="email"
              required
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              className="w-full bg-white border border-sage/30 rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-botanicalText mb-1.5">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              className="w-full bg-white border border-sage/30 rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-botanicalText mb-1.5">City *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-white border border-sage/30 rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-botanicalText mb-1.5">
                District *
              </label>
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full bg-white border border-sage/30 rounded-xl px-4 py-3 text-sm"
              >
                {SL_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-botanicalText mb-1.5">
                Postal Code
              </label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full bg-white border border-sage/30 rounded-xl px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-botanicalText mb-1.5">
              Order Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={form.orderNotes}
              onChange={(e) => setForm({ ...form, orderNotes: e.target.value })}
              className="w-full bg-white border border-sage/30 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div className="pt-4 border-t border-sage/20 space-y-3">
            <h2 className="font-serif text-xl font-semibold text-forest">2. Payment Method</h2>

            {[
              {
                id: 'COD',
                title: 'Cash on Delivery (Islandwide)',
                desc: 'Pay in LKR upon receiving your sealed parcel at your doorstep.',
              },
              {
                id: 'BANK_TRANSFER',
                title: 'Direct Bank Transfer',
                desc: 'Transfer to Yasithma Products Sri Lanka bank account (details shown after placing order).',
              },
              {
                id: 'PAYHERE',
                title: 'Online Card / Mobile Payment (PayHere Sri Lanka — Integration Ready)',
                desc: 'Supports Visa, Mastercard, LankaQR, and FriMi once merchant credentials are active.',
              },
            ].map((pm) => (
              <label
                key={pm.id}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  form.paymentMethod === pm.id
                    ? 'border-forest bg-forest/5'
                    : 'border-sage/25 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === pm.id}
                  onChange={() =>
                    setForm({ ...form, paymentMethod: pm.id as typeof form.paymentMethod })
                  }
                  className="mt-1 text-forest focus:ring-forest"
                />
                <div>
                  <p className="text-sm font-semibold text-forest">{pm.title}</p>
                  <p className="text-xs text-botanicalText/70 mt-0.5">{pm.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-ivory-light p-6 sm:p-8 rounded-3xl border border-sage/20 space-y-5 sticky top-28">
            <h2 className="font-serif text-xl font-semibold text-forest">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-xs">
                  <span>
                    {item.name} ({item.netWeight}) × <strong>{item.quantity}</strong>
                  </span>
                  <span className="font-semibold">
                    LKR {(item.priceLkr * item.quantity).toLocaleString('en-LK')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-sage/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0
                    ? 'FREE'
                    : `LKR ${deliveryFee.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-forest pt-2 border-t border-sage/20">
                <span>Total (LKR)</span>
                <span>LKR {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {error && (
              <p className="text-xs text-terracotta bg-terracotta/10 p-3 rounded-xl font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-forest text-ivory py-4 px-6 rounded-full text-sm font-semibold hover:bg-forest-dark disabled:opacity-50 transition shadow-botanical"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Confirming Order...' : 'Place Order'}
            </button>

            <a
              href={waOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 border border-forest/30 text-forest py-3.5 px-6 rounded-full text-xs font-semibold hover:bg-forest/5 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Prefer WhatsApp? Send Order via WhatsApp
            </a>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-botanicalText/65">
              <ShieldCheck className="w-4 h-4 text-forest" />
              Server-validated stock & pricing in LKR
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}
