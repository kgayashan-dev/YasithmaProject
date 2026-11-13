'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { buildWhatsAppOrderUrl } from '@/lib/whatsapp';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, getSubtotal } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const freeThreshold = 3500;
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= freeThreshold ? 0 : 350;
  const total = subtotal + deliveryFee;

  const waUrl = buildWhatsAppOrderUrl({
    items: items.map((i) => ({
      name: i.name,
      netWeight: i.netWeight,
      quantity: i.quantity,
      priceLkr: i.priceLkr,
    })),
    subtotalLkr: subtotal,
    deliveryFeeLkr: deliveryFee,
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-botanicalText/45 backdrop-blur-xs"
        onClick={closeDrawer}
      />
      <aside
        aria-label="Shopping Cart"
        className="relative w-full max-w-md bg-ivory h-full shadow-2xl flex flex-col justify-between z-10 border-l border-sage/20"
      >
        <div className="p-6 border-b border-sage/20 flex items-center justify-between bg-ivory-light">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-forest" />
            <h2 className="font-serif text-xl font-semibold text-forest">Your Basket</h2>
          </div>
          <button
            type="button"
            aria-label="Close basket"
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-sage/15 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length > 0 && subtotal < freeThreshold && (
          <div className="bg-sage-soft/60 px-6 py-2.5 text-xs text-forest text-center border-b border-sage/20">
            Add{' '}
            <strong>
              LKR {(freeThreshold - subtotal).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </strong>{' '}
            more for <strong>FREE Islandwide Delivery</strong>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-sage-soft flex items-center justify-center text-forest">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-serif text-xl text-forest">Your herbal basket is empty</p>
              <p className="text-xs text-botanicalText/70 max-w-xs">
                Explore our Ceylon floral teas and finely milled botanical powders.
              </p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="bg-forest text-ivory text-xs font-semibold px-6 py-3 rounded-full hover:bg-forest-dark transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 bg-ivory-light p-3.5 rounded-2xl border border-sage/20"
              >
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-ivory-dark shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeDrawer}
                        className="font-serif text-sm font-semibold text-forest hover:underline line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeItem(item.productId)}
                        className="text-botanicalText/50 hover:text-terracotta transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-sage">{item.netWeight}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="inline-flex items-center border border-sage/30 rounded-full bg-ivory">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 text-forest hover:bg-sage/10 rounded-l-full"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 text-forest hover:bg-sage/10 rounded-r-full"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-forest">
                      LKR {(item.priceLkr * item.quantity).toLocaleString('en-LK')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-sage/20 bg-ivory-light space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-botanicalText/80">
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-botanicalText/80">
                <span>Islandwide Delivery</span>
                <span>
                  {deliveryFee === 0
                    ? 'FREE'
                    : `LKR ${deliveryFee.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-forest pt-2 border-t border-sage/20">
                <span>Total</span>
                <span>LKR {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full inline-flex items-center justify-center gap-2 bg-forest text-ivory py-3.5 px-6 rounded-full text-sm font-semibold hover:bg-forest-dark transition"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 border border-forest/30 text-forest py-3 px-6 rounded-full text-xs font-semibold hover:bg-forest/5 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
