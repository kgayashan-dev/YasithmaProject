'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard, { ProductCardData } from '@/components/product/ProductCard';
import { useCartStore } from '@/store/useCartStore';

export default function BestSellersSection({ products }: { products: ProductCardData[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCardData | null>(null);
  const { addItem } = useCartStore();

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
              Pure Ceylon Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-forest mt-2">
              Featured Herbal Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-terracotta transition"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </div>

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-botanicalText/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-sage/20 grid md:grid-cols-2 relative">
            <button
              type="button"
              aria-label="Close quick view"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-forest hover:text-ivory transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-square md:aspect-auto bg-ivory-dark">
              <Image
                src={quickViewProduct.imageUrl}
                alt={quickViewProduct.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                  {quickViewProduct.categoryName} • {quickViewProduct.netWeight}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-forest">
                  {quickViewProduct.name}
                </h3>
                <p className="text-lg font-bold text-forest">
                  LKR{' '}
                  {quickViewProduct.priceLkr.toLocaleString('en-LK', {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-botanicalText/80 leading-relaxed">
                  {quickViewProduct.shortDescription}
                </p>
                <div className="text-xs bg-ivory-light p-3 rounded-xl border border-sage/20">
                  <strong className="text-forest">Ingredients:</strong>{' '}
                  {quickViewProduct.ingredients}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      productId: quickViewProduct.id,
                      name: quickViewProduct.name,
                      slug: quickViewProduct.slug,
                      netWeight: quickViewProduct.netWeight,
                      priceLkr: quickViewProduct.priceLkr,
                      imageUrl: quickViewProduct.imageUrl,
                      stockQuantity: quickViewProduct.stockQuantity,
                    });
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-forest text-ivory py-3 px-5 rounded-full text-sm font-semibold hover:bg-forest-dark transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <Link
                  href={`/products/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="inline-flex items-center justify-center border border-forest/30 text-forest py-3 px-5 rounded-full text-sm font-semibold hover:bg-forest/5 transition"
                >
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section> 
  );
}
