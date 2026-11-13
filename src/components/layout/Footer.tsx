import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-forest text-ivory/90 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-ivory/15">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ivory/10 border border-gold flex items-center justify-center">
              <span className="font-serif text-gold font-bold text-lg">YA</span>
            </div>
            <div>
              <p className="font-serif text-xl font-semibold text-ivory">Yasithma Products</p>
              <p className="text-[11px] text-gold tracking-widest uppercase">
                Pure Ceylon Botanicals
              </p>
            </div>
          </div>
          <p className="text-xs text-ivory/75 leading-relaxed">
            Authentic Sri Lankan herbal teas, finely milled botanical powders, and natural
            ingredients crafted for everyday wellness.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-base font-semibold text-gold mb-4">Quick Links</h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/shop" className="hover:text-gold transition">Shop All Products</Link></li>
            <li><Link href="/#our-story" className="hover:text-gold transition">Our Story</Link></li>
            <li><Link href="/#journal" className="hover:text-gold transition">Botanical Journal</Link></li>
            <li><Link href="/account" className="hover:text-gold transition">Customer Account & Tracking</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-base font-semibold text-gold mb-4">Store Policies</h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/shop" className="hover:text-gold transition">Shipping & Islandwide Delivery</Link></li>
            <li><Link href="/shop" className="hover:text-gold transition">Return & Refund Policy</Link></li>
            <li><Link href="/shop" className="hover:text-gold transition">Privacy Policy</Link></li>
            <li><Link href="/shop" className="hover:text-gold transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div className="space-y-3 text-xs">
          <h3 className="font-serif text-base font-semibold text-gold mb-4">Contact Us</h3>
          <p className="flex items-start gap-2.5 text-ivory/80">
            <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <span>No. 48, Algama Road, Mahapitiya, Pothuhera, Sri Lanka</span>
          </p>
          <p className="flex items-center gap-2.5 text-ivory/80">
            <Phone className="w-4 h-4 text-gold shrink-0" />
            <a href="tel:+94767644654" className="hover:text-gold">076 764 4654</a>
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/94767644654?text=Hello%20Yasithma%20Products%2C%20I%20would%20like%20to%20inquire%20about%20your%20herbal%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-forest font-semibold px-4 py-2.5 rounded-full hover:bg-ivory transition"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/60 gap-4">
        <p>© {new Date().getFullYear()} Yasithma Products. All rights reserved.</p>
        <p>Prices in Sri Lankan Rupees (LKR) • Islandwide Delivery</p>
      </div>
    </footer>
  );
}
