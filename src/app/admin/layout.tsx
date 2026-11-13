import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Store } from 'lucide-react';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/account');
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-forest text-ivory p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <p className="font-serif text-xl font-semibold text-gold">Yasithma Admin</p>
            <p className="text-[11px] text-ivory/70">Botanical Store Management</p>
          </div>

          <nav className="space-y-2 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-light transition"
            >
              <LayoutDashboard className="w-4 h-4 text-gold" />
              Dashboard Overview
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-light transition"
            >
              <Package className="w-4 h-4 text-gold" />
              Products & Stock
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-light transition"
            >
              <ShoppingCart className="w-4 h-4 text-gold" />
              Orders & Fulfillment
            </Link>
          </nav>
        </div>

        <Link
          href="/"
          className="mt-8 flex items-center gap-2 text-xs text-gold hover:underline"
        >
          <Store className="w-4 h-4" />
          Back to Public Storefront
        </Link>
      </aside>

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
