'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, X, Leaf, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar({
  announcementText = 'Discover the Goodness of Pure Ceylon Botanicals',
}: {
  announcementText?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { openDrawer, getTotalCount, wishlistIds } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/shop#categories' },
    { name: 'Our Story', href: '/#our-story' },
    { name: 'Journal', href: '/#journal' },
    { name: 'Contact Us', href: '/#contact' },
  ];

  return (
    <>
      <div className="bg-forest text-ivory text-xs sm:text-sm py-2 px-4 text-center tracking-wide font-medium">
        <span className="inline-flex items-center gap-2">
          <Leaf className="w-3.5 h-3.5 text-gold" />
          {announcementText}
        </span>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-botanical py-3 border-b border-sage/20'
            : 'bg-ivory py-4 border-b border-sage/15'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-botanicalText hover:text-forest transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center border border-gold/60 shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif text-gold font-bold text-lg tracking-tighter">YA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-semibold text-forest leading-none tracking-tight">
                Yasithma
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-sage font-semibold mt-0.5">
                Products • Ceylon
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-botanicalText/85 hover:text-forest relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-gold hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-botanicalText hover:text-forest transition rounded-full hover:bg-sage/10"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/account"
              aria-label="Customer Account"
              className="hidden sm:inline-flex p-2 text-botanicalText hover:text-forest transition rounded-full hover:bg-sage/10"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/account#wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-botanicalText hover:text-forest transition rounded-full hover:bg-sage/10"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-terracotta text-ivory text-[10px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="Open Shopping Cart"
              onClick={openDrawer}
              className="relative p-2 text-botanicalText hover:text-forest transition rounded-full hover:bg-sage/10"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && getTotalCount() > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-forest text-ivory text-[10px] font-bold flex items-center justify-center">
                  {getTotalCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-sage/20 bg-ivory-light py-3 px-4">
            <form action="/shop" method="GET" className="max-w-2xl mx-auto flex items-center gap-2">
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbal teas, Heen Bovitiya, Blue Butterfly, Welpenala..."
                className="w-full bg-white border border-sage/30 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-forest"
                autoFocus
              />
              <button
                type="submit"
                className="bg-forest text-ivory px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-dark transition"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-botanicalText/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-ivory h-full shadow-2xl flex flex-col justify-between p-6 z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-sage/20">
                <span className="font-serif text-xl font-semibold text-forest">
                  Yasithma Products
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-sage/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 rounded-xl text-base font-medium text-botanicalText hover:bg-sage/15 hover:text-forest transition"
                  >
                    {link.name}
                    <ChevronRight className="w-4 h-4 text-sage" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-sage/20 space-y-3">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 w-full py-3 px-4 rounded-xl bg-forest text-ivory text-sm font-medium justify-center"
              >
                <User className="w-4 h-4" />
                My Account & Orders
              </Link>
              <p className="text-xs text-center text-botanicalText/70">
                Pothuhera, Sri Lanka • 076 764 4654
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
