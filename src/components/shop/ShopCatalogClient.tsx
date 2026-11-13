'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard, { ProductCardData } from '@/components/product/ProductCard';

interface CategoryOption {
  slug: string;
  name: string;
}

export default function ShopCatalogClient({
  products,
  categories,
  initialCategory = '',
  initialQuery = '',
}: {
  products: ProductCardData[];
  categories: CategoryOption[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory && p.categorySlug !== selectedCategory) return false;
        if (inStockOnly && (!p.isAvailable || p.stockQuantity <= 0)) return false;
        if (p.priceLkr > maxPrice) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            (p.sinhalaName && p.sinhalaName.toLowerCase().includes(q)) ||
            p.ingredients.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceLkr - b.priceLkr;
        if (sortBy === 'price-desc') return b.priceLkr - a.priceLkr;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, inStockOnly, maxPrice, search, sortBy]);

  const FilterControls = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-base font-semibold text-forest mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
              selectedCategory === ''
                ? 'bg-forest text-ivory'
                : 'hover:bg-sage/15 text-botanicalText'
            }`}
          >
            All Botanicals ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat.slug
                  ? 'bg-forest text-ivory'
                  : 'hover:bg-sage/15 text-botanicalText'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-sage/20">
        <div className="flex justify-between text-xs font-semibold text-forest mb-2">
          <span>Max Price</span>
          <span>LKR {maxPrice}</span>
        </div>
        <input
          type="range"
          min={200}
          max={1000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-forest"
        />
      </div>

      <div className="pt-4 border-t border-sage/20">
        <label className="flex items-center gap-2.5 text-xs font-medium text-botanicalText cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded border-sage text-forest focus:ring-forest"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-sage/20">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-sage absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by herb name, Sinhala name, or ingredient..."
            className="w-full bg-ivory-light border border-sage/30 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 bg-ivory-light border border-sage/30 px-4 py-2.5 rounded-full text-xs font-semibold text-forest"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-ivory-light border border-sage/30 rounded-full px-4 py-2.5 text-xs font-semibold text-forest focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Main Layout */}
      <div className="pt-8 grid lg:grid-cols-12 gap-8">
        <aside className="hidden lg:block lg:col-span-3 bg-ivory-light p-6 rounded-3xl border border-sage/20 h-fit sticky top-28">
          <FilterControls />
        </aside>

        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-ivory-light rounded-3xl p-12 text-center border border-sage/20 space-y-3">
              <p className="font-serif text-2xl text-forest">No matching herbal products found</p>
              <p className="text-xs text-botanicalText/70">
                Try adjusting your search keywords or resetting filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                  setMaxPrice(1000);
                  setInStockOnly(false);
                }}
                className="bg-forest text-ivory text-xs font-semibold px-5 py-2.5 rounded-full"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-botanicalText/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-80 bg-ivory h-full p-6 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-sage/20">
              <span className="font-serif text-lg font-semibold text-forest">Filter Catalogue</span>
              <button type="button" onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterControls />
          </div>
        </div>
      )}
    </div>
  );
}
