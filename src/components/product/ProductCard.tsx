'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export interface ProductCardData {
  id: string;
  name: string;
  sinhalaName?: string | null;
  slug: string;
  categoryName: string;
  categorySlug?: string;
  netWeight: string;
  priceLkr: number;
  isSamplePrice?: boolean;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrl: string;
  shortDescription: string;
  ingredients: string;
  preparationUsage?: string | null;
}

interface ProductCardProps {
  product: ProductCardData;
  onQuickView?: (product: ProductCardData) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem, toggleWishlist, wishlistIds } = useCartStore();
  const isWishlisted = wishlistIds.includes(product.id);
  const inStock = product.isAvailable && product.stockQuantity > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      netWeight: product.netWeight,
      priceLkr: product.priceLkr,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
    });
  };

  return (
    <article className="group bg-ivory-light rounded-2xl border border-sage/20 overflow-hidden shadow-botanical hover:shadow-cardHover transition-all duration-300 flex flex-col">
      <div className="relative aspect-[4/5] bg-ivory-dark/40 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.imageUrl}
            alt={`${product.name} - Yasithma Products`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-ivory/95 backdrop-blur-xs text-forest text-[11px] font-semibold px-3 py-1 rounded-full border border-sage/20">
            {product.categoryName}
          </span>
          {!inStock && (
            <span className="bg-terracotta text-ivory text-[11px] font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            type="button"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => toggleWishlist(product.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-xs transition shadow-sm ${
              isWishlisted
                ? 'bg-terracotta text-ivory'
                : 'bg-ivory/90 text-botanicalText hover:bg-forest hover:text-ivory'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {onQuickView && (
            <button
              type="button"
              aria-label="Quick view product"
              onClick={() => onQuickView(product)}
              className="w-9 h-9 rounded-full bg-ivory/90 text-botanicalText hover:bg-forest hover:text-ivory flex items-center justify-center backdrop-blur-xs transition shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-botanicalText/70 mb-1">
            <span>Net Wt: {product.netWeight}</span>
            <span className={inStock ? 'text-forest font-medium' : 'text-terracotta'}>
              {inStock ? 'In Stock' : 'Unavailable'}
            </span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg font-semibold text-botanicalText group-hover:text-forest transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.sinhalaName && (
            <p className="text-xs text-sage font-medium mt-0.5">{product.sinhalaName}</p>
          )}

          <p className="text-xs text-botanicalText/75 mt-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-sage/15 flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-bold text-forest">
              LKR {product.priceLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
            {product.isSamplePrice && (
              <span className="block text-[10px] text-terracotta">Sample price • Editable</span>
            )}
          </div>

          <button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 bg-forest text-ivory text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-forest-dark disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
