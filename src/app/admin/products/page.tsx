import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import ProductManager from '@/components/admin/ProductManager';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, categories, files] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    fs.readdir(path.join(process.cwd(), 'public/images/products')).catch(() => []),
  ]);

  const imageOptions = files
    .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file))
    .map((file) => `/images/products/${file}`);

  return (
    <ProductManager
      initialProducts={products.map((product) => ({
        ...product,
        priceLkr: Number(product.priceLkr),
        imageUrl: product.images[0]?.url || '',
      }))}
      categories={categories}
      imageOptions={imageOptions}
    />
  );
}
