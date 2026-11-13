import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { prisma } from '@/lib/prisma';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar announcementText={settings?.announcementText} />
      <CartDrawer />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
