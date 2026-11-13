import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  Sprout,
  Truck,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import BestSellersSection from '@/components/home/BestSellersSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, featuredProducts, approvedReviews] = await Promise.all([
    prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null),
    prisma.category.findMany({ take: 4 }).catch(() => []),
    prisma.product
      .findMany({
        where: { isAvailable: true },
        include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
        take: 8,
      })
      .catch(() => []),
    prisma.review
      .findMany({
        where: { isApproved: true },
        include: { user: { select: { fullName: true } }, product: { select: { name: true } } },
        take: 3,
        orderBy: { createdAt: 'desc' },
      })
      .catch(() => []),
  ]);

  const serializedProducts = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sinhalaName: p.sinhalaName,
    slug: p.slug,
    categoryName: p.category.name,
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

  const articles = [
    {
      title: 'The Art of Brewing Whole-Flower Ceylon Herbal Teas',
      category: 'Preparation Guide',
      excerpt:
        'Learn ideal water temperatures and steeping times to preserve the vivid natural pigments and delicate aroma of Blue Butterfly and Hibiscus blossoms.',
      readTime: '4 min read',
    },
    {
      title: 'How to Store Botanical Powders in Tropical Climates',
      category: 'Freshness & Care',
      excerpt:
        'Simple habits to protect finely milled herbal powders like Heen Bovitiya and Curry Leaves from humidity and sunlight.',
      readTime: '3 min read',
    },
    {
      title: 'Exploring Sri Lanka’s Traditional Botanical Pantry',
      category: 'Ceylon Heritage',
      excerpt:
        'An introduction to time-honored Sri Lankan herbs—from Iramusu to Welpenala—and how they are enjoyed in everyday life.',
      readTime: '5 min read',
    },
  ];

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory-light via-ivory to-sage-soft/40 pt-10 pb-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/10 text-forest text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              Pure Ceylon Botanicals, Naturally Yours
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-forest leading-[1.12] tracking-tight">
              {settings?.heroHeadline || "Nature's Finest, From the Heart of Ceylon."}
            </h1>

            <p className="text-base sm:text-lg text-botanicalText/80 max-w-xl leading-relaxed">
              {settings?.heroSubheadline ||
                "Discover carefully selected herbal teas, botanical powders, and natural products inspired by Sri Lanka's rich botanical heritage."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-forest text-ivory px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-forest-dark transition shadow-botanical"
              >
                Shop Our Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#our-story"
                className="inline-flex items-center gap-2 bg-transparent border border-forest/30 text-forest px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-forest/5 transition"
              >
                Discover Our Story
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sage/20 max-w-lg">
              <div>
                <p className="font-serif text-xl font-semibold text-forest">100%</p>
                <p className="text-xs text-botanicalText/70">Ceylon Sourced Herbs</p>
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-forest">Sealed</p>
                <p className="text-xs text-botanicalText/70">Freshness Barrier Pouches</p>
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-forest">Islandwide</p>
                <p className="text-xs text-botanicalText/70">Sri Lanka Delivery</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 items-center">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-cardHover border-4 border-ivory-light">
                <Image
                  src="/images/products/blue-butterfly-flower-tea.jpeg"
                  alt="Yasithma Blue Butterfly Flower Tea with glass teapot"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="space-y-4 sm:space-y-6 pt-8">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-botanical border-4 border-ivory-light">
                  <Image
                    src="/images/products/heen-bovitiya-powder.jpeg"
                    alt="Yasithma Heen Bovitiya Powder"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-botanical border-4 border-ivory-light">
                  <Image
                    src="/images/products/curry-leaves-powder.jpeg"
                    alt="Yasithma Curry Leaves Powder"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-20 bg-ivory-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-forest mt-2">
              Shop by Botanical Category
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden bg-ivory border border-sage/20 shadow-botanical hover:shadow-cardHover transition-all flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={cat.imageUrl || '/images/products/yasithma-product-collection.jpeg'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 text-ivory">
                    <h3 className="font-serif text-2xl font-semibold">{cat.name}</h3>
                    <p className="text-xs text-ivory/90 mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-center justify-between text-sm font-semibold text-forest bg-ivory">
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BestSellersSection products={serializedProducts} />

      <section className="py-20 bg-forest text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Our Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-2">
              Why Choose Yasithma Products?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: Sprout,
                title: 'Botanical Heritage',
                desc: 'Inspired by generations of traditional Sri Lankan herbal wisdom.',
              },
              {
                icon: Leaf,
                title: 'Carefully Selected',
                desc: 'Leaves, flowers, and spices chosen for vibrant color and natural aroma.',
              },
              {
                icon: CheckCircle2,
                title: 'Authentic Ceylon',
                desc: 'Grown, harvested, and packed in Sri Lanka with pride.',
              },
              {
                icon: ShieldCheck,
                title: 'Quality-Focused Prep',
                desc: 'Hygienically milled and sealed in resealable freshness pouches.',
              },
              {
                icon: Truck,
                title: 'Convenient Ordering',
                desc: 'Seamless online checkout or direct WhatsApp ordering across Sri Lanka.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-forest-light/40 border border-gold/20 rounded-2xl p-6 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-ivory">{item.title}</h3>
                <p className="text-xs text-ivory/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-ivory-light rounded-3xl border border-sage/25 overflow-hidden shadow-botanical grid lg:grid-cols-12">
            <div className="lg:col-span-6 relative min-h-[360px]">
              <Image
                src="/images/products/hibiscus-flower-tea.jpeg"
                alt="Vibrant Ceylon Hibiscus and Blue Butterfly Flower Teas"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-5">
              <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
                Featured Botanical Ritual
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-forest leading-tight">
                Whole-Blossom Infusions Steeped in Natural Color
              </h2>
              <p className="text-sm sm:text-base text-botanicalText/80 leading-relaxed">
                From the deep sapphire hues of <strong>Blue Butterfly Flower Tea</strong> to the
                ruby tartness of <strong>Hibiscus Flower Tea</strong> and soothing aroma of{' '}
                <strong>Iramusu</strong>, our whole-botanical pouches bring unhurried Ceylon tea
                rituals to your daily routine.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?category=herbal-teas"
                  className="inline-flex items-center gap-2 bg-terracotta text-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-terracotta-dark transition"
                >
                  Explore Herbal Teas
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="our-story" className="py-20 bg-sage-soft/45 border-y border-sage/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-botanical">
            <Image
              src="/images/products/yasithma-product-collection.jpeg"
              alt="A collection of herbal teas, botanical powders, and Ceylon spices from Yasithma Products"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
              Our Sri Lankan Roots
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-forest">
              Crafted with Care in Pothuhera, Sri Lanka
            </h2>
            <p className="text-base text-botanicalText/85 leading-relaxed">
              {settings?.aboutStory ||
                'Rooted in Pothuhera, Sri Lanka, Yasithma Products is dedicated to bringing authentic Ceylon herbal teas, finely milled botanical powders, and traditional natural ingredients from local gardens to modern homes.'}
            </p>
            <p className="text-sm text-botanicalText/75 leading-relaxed">
              Every pouch of Yasithma Products—whether finely milled Heen Bovitiya, Welpenala,
              Yaki Naran, or fragrant Ceylon Curry Leaves—is packed in resealable barrier
              pouches to lock in natural freshness without artificial additives.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-ivory-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
              Community Voices
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-forest mt-2">
              Verified Customer Reviews
            </h2>
          </div>

          {approvedReviews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {approvedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-ivory p-7 rounded-2xl border border-sage/20 shadow-botanical space-y-3"
                >
                  <p className="text-sm text-botanicalText/85 italic">&ldquo;{rev.comment}&rdquo;</p>
                  <div className="pt-2 border-t border-sage/15">
                    <p className="text-sm font-semibold text-forest">{rev.user.fullName}</p>
                    <p className="text-xs text-sage">Purchased: {rev.product.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center bg-ivory p-8 rounded-2xl border border-sage/20">
              <p className="text-sm text-botanicalText/80">
                Have you tried Yasithma Products? Share your experience on any product page once
                your order arrives—approved customer reviews appear right here.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="journal" className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
              Botanical Journal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-forest mt-2">
              Guides & Sri Lankan Herbal Traditions
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.title}
                className="bg-ivory-light rounded-2xl p-7 border border-sage/20 shadow-botanical flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-terracotta font-semibold">
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-forest leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-botanicalText/75 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-sage/15 flex items-center gap-2 text-xs font-semibold text-forest">
                  <BookOpen className="w-4 h-4 text-sage" />
                  <span>Botanical Note</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}
