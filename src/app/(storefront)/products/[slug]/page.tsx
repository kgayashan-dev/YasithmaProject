import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import ProductCard from '@/components/product/ProductCard';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.metaTitle || `${product.name} (${product.netWeight})`,
    description: product.metaDescription || product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product
    .findUnique({
      where: { slug: params.slug },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    })
    .catch(() => null);

  if (!product) notFound();

  const related = await prisma.product
    .findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isAvailable: true },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
      take: 4,
    })
    .catch(() => []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'Yasithma Products' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'LKR',
      price: Number(product.priceLkr).toFixed(2),
      availability:
        product.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="bg-ivory pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProductDetailClient
        product={{
          id: product.id,
          name: product.name,
          sinhalaName: product.sinhalaName,
          botanicalName: product.botanicalName,
          slug: product.slug,
          sku: product.sku,
          categoryName: product.category.name,
          shortDescription: product.shortDescription,
          detailedDescription: product.detailedDescription,
          ingredients: product.ingredients,
          netWeight: product.netWeight,
          priceLkr: Number(product.priceLkr),
          isSamplePrice: product.isSamplePrice,
          stockQuantity: product.stockQuantity,
          isAvailable: product.isAvailable,
          preparationUsage: product.preparationUsage,
          storageInstructions: product.storageInstructions,
          batchNumber: product.batchNumber,
          images: product.images.map((i) => ({ id: i.id, url: i.url, altText: i.altText })),
        }}
      />

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-sage/20">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-forest mb-8">
            Related Ceylon Botanicals
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => (
              <ProductCard
                key={r.id}
                product={{
                  id: r.id,
                  name: r.name,
                  sinhalaName: r.sinhalaName,
                  slug: r.slug,
                  categoryName: r.category.name,
                  netWeight: r.netWeight,
                  priceLkr: Number(r.priceLkr),
                  isSamplePrice: r.isSamplePrice,
                  stockQuantity: r.stockQuantity,
                  isAvailable: r.isAvailable,
                  imageUrl: r.images[0]?.url || '/images/products/yasithma-product-collection.jpeg',
                  shortDescription: r.shortDescription,
                  ingredients: r.ingredients,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
