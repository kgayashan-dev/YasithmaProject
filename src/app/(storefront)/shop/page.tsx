import React from 'react';
import { prisma } from '@/lib/prisma';
import ShopCatalogClient from '@/components/shop/ShopCatalogClient';

export const metadata = {
  title: 'Shop Pure Ceylon Herbal Teas & Powders',
  description:
    'Browse authentic Sri Lankan Blue Butterfly Flower Tea, Heen Bovitiya Powder, Welpenala Powder, Curry Leaves Powder, Hibiscus Tea, and Iramusu.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const [categories, products] = await Promise.all([
    prisma.category.findMany().catch(() => []),
    prisma.product
      .findMany({
        include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
        orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
      })
      .catch(() => []),
  ]);

  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    sinhalaName: p.sinhalaName,
    slug: p.slug,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    netWeight: p.netWeight,
    priceLkr: Number(p.priceLkr),
    isSamplePrice: p.isSamplePrice,
    stockQuantity: p.stockQuantity,
    isAvailable: p.isAvailable,
    imageUrl: p.images[0]?.url || '/images/products/yasithma-product-collection.jpeg',
    shortDescription: p.shortDescription,
    ingredients: p.ingredients,
    preparationUsage: p.preparationUsage,
  }));

  return (
    <main className="min-h-screen bg-ivory">
      <section className="bg-forest text-ivory py-14 px-4 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
          Yasithma Botanical Catalogue
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold mt-2">
          Pure Ceylon Herbal Collection
        </h1>
        <p className="text-xs sm:text-sm text-ivory/80 max-w-xl mx-auto mt-3">
          Carefully harvested flowers, leaves, and traditional Sri Lankan botanicals sealed for
          lasting freshness.
        </p>
      </section>

      <ShopCatalogClient
        products={serialized}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        initialCategory={searchParams.category || ''}
        initialQuery={searchParams.q || ''}
      />
    </main>
  );
}
