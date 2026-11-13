'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Plus, Minus, ShieldCheck, Leaf, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export interface ProductDetailData {
  id: string;
  name: string;
  sinhalaName?: string | null;
  botanicalName?: string | null;
  slug: string;
  sku: string;
  categoryName: string;
  shortDescription: string;
  detailedDescription: string;
  ingredients: string;
  netWeight: string;
  priceLkr: number;
  isSamplePrice: boolean;
  stockQuantity: number;
  isAvailable: boolean;
  preparationUsage?: string | null;
  storageInstructions?: string | null;
  batchNumber?: string | null;
  images: { id: string; url: string; altText: string }[];
}

export default function ProductDetailClient({ product }: { product: ProductDetailData }) {
  const router = useRouter();
  const { addItem, toggleWishlist, wishlistIds } = useCartStore();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage' | 'storage'>(
    'description'
  );

  const isWishlisted = wishlistIds.includes(product.id);
  const inStock = product.isAvailable && product.stockQuantity > 0;
  const primaryImage =
    product.images[selectedImg]?.url || '/images/products/yasithma-product-collection.jpeg';

  const handleAdd = (redirectCheckout = false) => {
    if (!inStock) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        netWeight: product.netWeight,
        priceLkr: product.priceLkr,
        imageUrl: primaryImage,
        stockQuantity: product.stockQuantity,
      },
      quantity
    );
    if (redirectCheckout) {
      router.push('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Image Gallery with Hover Zoom */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ivory-light border border-sage/20 shadow-botanical group">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority
              className="object-cover group-hover:scale-110 transition-transform duration-700 cursor-zoom-in"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImg(idx)}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 ${
                    selectedImg === idx ? 'border-forest' : 'border-transparent opacity-70'
                  }`}
                >
                  <Image src={img.url} alt={img.altText} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Purchase Info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-terracotta">
              <span>{product.categoryName}</span>
              <span>•</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-forest">
              {product.name}
            </h1>

            {(product.sinhalaName || product.botanicalName) && (
              <p className="text-sm text-sage font-medium">
                {[product.sinhalaName, product.botanicalName].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-4 pb-6 border-b border-sage/20">
            <span className="text-3xl font-bold text-forest">
              LKR {product.priceLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sage-soft text-forest">
              Net Weight: {product.netWeight}
            </span>
            <span
              className={`text-xs font-semibold ${inStock ? 'text-forest' : 'text-terracotta'}`}
            >
              {inStock ? `In Stock (${product.stockQuantity} pouches)` : 'Out of Stock'}
            </span>
          </div>

          {product.isSamplePrice && (
            <p className="text-xs text-terracotta bg-terracotta/10 px-4 py-2 rounded-xl">
              Note: Sample price displayed — configurable anytime via the Yasithma Admin Dashboard.
            </p>
          )}

          <p className="text-sm sm:text-base text-botanicalText/85 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Quantity + CTAs */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center border border-sage/40 rounded-full bg-ivory-light px-2 py-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-forest hover:bg-sage/10 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="p-2 text-forest hover:bg-sage/10 rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                aria-label="Toggle wishlist"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-full border transition ${
                  isWishlisted
                    ? 'bg-terracotta text-ivory border-terracotta'
                    : 'border-sage/40 text-forest hover:bg-sage/10'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!inStock}
                onClick={() => handleAdd(false)}
                className="inline-flex items-center justify-center gap-2 bg-forest text-ivory py-4 px-6 rounded-full text-sm font-semibold hover:bg-forest-dark disabled:opacity-40 transition shadow-botanical"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Basket
              </button>
              <button
                type="button"
                disabled={!inStock}
                onClick={() => handleAdd(true)}
                className="inline-flex items-center justify-center gap-2 bg-terracotta text-ivory py-4 px-6 rounded-full text-sm font-semibold hover:bg-terracotta-dark disabled:opacity-40 transition"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Packaging Assurance Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-sage/20 text-xs text-botanicalText/80">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-forest shrink-0" />
              <span>Pure Ceylon Botanical</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-forest shrink-0" />
              <span>Resealable Pouch</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
              <span>Packed in Sri Lanka</span>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="pt-6">
            <div className="flex gap-2 border-b border-sage/20 overflow-x-auto">
              {(
                [
                  { id: 'description', label: 'Description' },
                  { id: 'ingredients', label: 'Ingredients' },
                  { id: 'usage', label: 'Preparation' },
                  { id: 'storage', label: 'Storage & Batch' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-forest text-forest'
                      : 'border-transparent text-botanicalText/60 hover:text-forest'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-5 text-sm text-botanicalText/85 leading-relaxed">
              {activeTab === 'description' && <p>{product.detailedDescription}</p>}
              {activeTab === 'ingredients' && <p>{product.ingredients}</p>}
              {activeTab === 'usage' && (
                <p>{product.preparationUsage || 'Follow standard herbal infusion preparation.'}</p>
              )}
              {activeTab === 'storage' && (
                <div className="space-y-2">
                  <p>{product.storageInstructions}</p>
                  {product.batchNumber && (
                    <p className="text-xs text-sage">Reference Batch No: {product.batchNumber}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-ivory/95 backdrop-blur-md border-t border-sage/25 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-sage">{product.netWeight}</p>
          <p className="text-base font-bold text-forest">
            LKR {product.priceLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <button
          type="button"
          disabled={!inStock}
          onClick={() => handleAdd(false)}
          className="bg-forest text-ivory px-6 py-3 rounded-full text-xs font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
