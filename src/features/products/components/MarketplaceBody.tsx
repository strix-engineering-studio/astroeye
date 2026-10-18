
"use client";

import Link from "next/link";

import type { Product } from "@/features/products/types/product.type";
import { useProductsQuery } from "../hooks/useProduct";

const categories = [
  {
    name: "Rudraksha",
    description: "Sacred beads, malas and spiritual essentials",
    icon: "◉",
    color: "bg-[#F2E5D2]",
    href: "/products?category=rudraksha",
  },
  {
    name: "Gemstones",
    description: "Natural stones and meaningful crystals",
    icon: "✧",
    color: "bg-[#E4E8F1]",
    href: "/products?category=gemstones",
  },
  {
    name: "Spiritual Jewellery",
    description: "Thoughtful pieces for everyday wear",
    icon: "◇",
    color: "bg-[#F3E3D6]",
    href: "/products?category=spiritual-jewellery",
  },
  {
    name: "Puja Essentials",
    description: "Traditional essentials for daily rituals",
    icon: "🪔",
    color: "bg-[#E8E6D8]",
    href: "/products?category=puja-essentials",
  },
  {
    name: "Idols & Murtis",
    description: "Sacred idols and devotional decor",
    icon: "ॐ",
    color: "bg-[#F0E2E2]",
    href: "/products?category=idols-and-murtis",
  },
  {
    name: "Yantras",
    description: "Traditional yantras and sacred symbols",
    icon: "✺",
    color: "bg-[#E2E9DE]",
    href: "/products?category=yantras",
  },
  {
    name: "Incense & Dhoop",
    description: "Incense, dhoop and aromatic essentials",
    icon: "♨",
    color: "bg-[#F1E7D8]",
    href: "/products?category=incense-and-dhoop",
  },
  {
    name: "Books",
    description: "Explore spiritual knowledge and traditions",
    icon: "▤",
    color: "bg-[#E5E5F0]",
    href: "/products?category=books",
  },
];

const highlights = [
  {
    icon: "✧",
    title: "Explore Collections",
    description:
      "Discover spiritual products across thoughtfully curated categories.",
  },
  {
    icon: "◇",
    title: "Convenient Shopping",
    description:
      "Browse products, compare options and shop from one destination.",
  },
  {
    icon: "↗",
    title: "Trusted Shopping Options",
    description:
      "Explore our available listings on supported shopping platforms.",
  },
  {
    icon: "♡",
    title: "Customer Support",
    description:
      "Get assistance with product details, purchases and order queries.",
  },
];

/**
 * Optional display fields used by this storefront.
 * Align these with the actual Product interface in product.type.ts.
 */
type StorefrontProduct = Product & {
  image?: string;
  imageUrl?: string;
  images?: string[];
  thumbnail?: string;
  category?: string;
  categoryName?: string;
  price?: number;
  compareAtPrice?: number;
  originalPrice?: number;
  slug?: string;
  description?: string;
};

function getProductImage(product: StorefrontProduct): string | undefined {
  return (
    product.imageUrl ||
    product.image ||
    product.thumbnail ||
    product.images?.[0]
  );
}

function getProductPrice(product: StorefrontProduct): number | undefined {
  const price = product.price;

  return typeof price === "number" && Number.isFinite(price)
    ? price
    : undefined;
}

function getOriginalPrice(
  product: StorefrontProduct,
): number | undefined {
  const price = product.compareAtPrice ?? product.originalPrice;

  return typeof price === "number" && Number.isFinite(price)
    ? price
    : undefined;
}

function getProductHref(product: StorefrontProduct): string {
  return `/products/${encodeURIComponent(product.slug || product.id)}`;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 sm:mb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9D693A]">
        {eyebrow}
      </p>

      <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-[#29251F] sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#777066] sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: StorefrontProduct }) {
  const image = getProductImage(product);
  const price = getProductPrice(product);
  const originalPrice = getOriginalPrice(product);

  return (
    <article className="group min-w-0">
      <Link
        href={getProductHref(product)}
        className="relative block overflow-hidden rounded-2xl bg-[#F0E9DF]"
      >
        <div className="aspect-[4/4.6] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl text-[#A16C3C]">
              ✧
            </div>
          )}
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-[#FCFAF6] px-3 py-1.5 text-[10px] font-semibold text-[#74583A] sm:text-xs">
          Featured
        </span>

        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FCFAF6] text-lg transition group-hover:bg-[#29251F] group-hover:text-white">
          ↗
        </span>
      </Link>

      <div className="mt-4">
        <p className="text-xs text-[#9B8B77]">
          {product.categoryName || product.category || "MagicalStones"}
        </p>

        <Link
          href={getProductHref(product)}
          className="mt-1 block text-sm font-medium leading-6 transition hover:text-[#956537] sm:text-base"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {price !== undefined && (
            <span className="text-sm font-semibold">
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}

          {originalPrice !== undefined &&
            price !== undefined &&
            originalPrice > price && (
              <span className="text-xs text-[#9B9185] line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
        </div>
      </div>
    </article>
  );
}

function ProductGridState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="col-span-full rounded-2xl border border-[#EBE4DA] bg-white px-5 py-12 text-center">
      <h3 className="font-serif text-2xl text-[#29251F]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#777066]">{description}</p>
    </div>
  );
}

export default function MarketplaceBody() {
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useProductsQuery({ all: false });

  const products = ((data ?? []) as StorefrontProduct[]).filter(
    (product) => product.isPublished === true,
  );

  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F2E8D8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#C5A67C]/30 sm:h-[480px] sm:w-[480px]" />

        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full border border-[#C5A67C]/30 sm:h-[400px] sm:w-[400px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8AC85] bg-white/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#77572F]">
              <span>✧</span>
              The MagicalStones collection
            </span>

            <h1 className="mt-7 max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight text-[#29251F] sm:text-6xl lg:text-7xl">
              Discover things
              <br />
              <span className="font-normal italic text-[#A16C3C]">
                that mean more.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#716657] sm:text-lg">
              Explore spiritual jewellery, gemstones, Rudraksha, puja
              essentials and meaningful finds for your home, traditions and
              everyday rituals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 rounded-full bg-[#29251F] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#514538]"
              >
                Explore Products <span>↗</span>
              </Link>

              <Link
                href="/products?category=all"
                className="inline-flex items-center gap-3 rounded-full border border-[#C8B69B] px-7 py-4 text-sm font-medium text-[#44372A] transition hover:bg-white/60"
              >
                Browse Categories
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#D9C9B1] pt-6 text-xs text-[#776957] sm:text-sm">
              <span>✧ Spiritual essentials</span>
              <span>◇ Meaningful finds</span>
              <span>♡ Thoughtful shopping</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-3 rounded-[48%_48%_16px_16px] border border-[#C5A67C]/50" />

            <div className="relative h-[370px] overflow-hidden rounded-[48%_48%_12px_12px] bg-[#D9C6A9] sm:h-[490px]">
              <img
                src="https://images.unsplash.com/photo-1604608672516-8c2b5f4d9d5e?auto=format&fit=crop&w=1100&q=90"
                alt="Spiritual accessories and traditional essentials"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#29251F]/75 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">
                <p className="text-xs uppercase tracking-[0.22em] text-[#EBD2AA]">
                  Thoughtfully selected
                </p>

                <h2 className="mt-3 max-w-sm font-serif text-3xl leading-tight sm:text-4xl">
                  Find something that feels personal.
                </h2>

                <Link
                  href="/shop"
                  className="mt-5 inline-flex items-center gap-2 border-b border-white/70 pb-1 text-sm"
                >
                  Shop the collection <span>↗</span>
                </Link>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 flex h-20 w-20 items-center justify-center rounded-full border border-[#D1B58D] bg-[#FCFAF6] font-serif text-3xl text-[#A16C3C] sm:-left-7 sm:h-24 sm:w-24">
              ॐ
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace highlights */}
      <section className="border-b border-[#EAE3D9] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-7 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {highlights.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3E9DA] text-xl text-[#956537]">
                {item.icon}
              </span>

              <div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#83786A]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Explore the marketplace"
            title="Find your kind of meaningful."
            description="Browse our product categories and discover items for personal use, gifting, your home and traditional practices."
          />

          <Link
            href="/categories"
            className="mb-9 text-sm font-medium text-[#956537] hover:underline"
          >
            View all categories ↗
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group rounded-2xl border border-[#EBE4DA] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-[#C8AD87] hover:shadow-lg hover:shadow-[#453622]/5 sm:p-6"
            >
              <div
                className={`flex aspect-[1.4/1] items-center justify-center rounded-xl ${category.color}`}
              >
                <span className="font-serif text-5xl text-[#74583A] transition group-hover:scale-110">
                  {category.icon}
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold sm:text-base">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#83786A]">
                    {category.description}
                  </p>
                </div>

                <span className="mt-1 text-[#A16C3C] transition group-hover:translate-x-1">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#2D2924]">
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-[#B99868]/25" />

          <div className="relative grid items-center gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1fr_auto] lg:px-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D2AC77]">
                Discover your next favourite
              </p>

              <h2 className="mt-4 font-serif text-3xl leading-tight text-[#FCF5E9] sm:text-5xl">
                Meaningful finds, all in one place.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#D2C6B5] sm:text-base">
                From everyday essentials to thoughtful gifts, explore a
                collection inspired by spirituality, tradition and mindful
                living.
              </p>

              <Link
                href="/shop"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#E4C79D] px-6 py-3.5 text-sm font-semibold text-[#29251F] transition hover:bg-[#F0DDBD]"
              >
                Explore the Collection <span>↗</span>
              </Link>
            </div>

            <div className="hidden h-40 w-40 items-center justify-center rounded-full border border-[#C7A46D]/50 font-serif text-7xl text-[#D2AC77] lg:flex">
              ॐ
            </div>
          </div>
        </div>
      </section>

      {/* Featured products from Firestore/service */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="The MagicalStones edit"
            title="Worth discovering."
            description="Explore selected products for your home, personal collection, traditions and gifting."
          />

          <Link
            href="/shop"
            className="mb-9 text-sm font-medium text-[#956537] hover:underline"
          >
            Shop all products ↗
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {isPending ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/4.6] rounded-2xl bg-[#EAE3D9]" />
                <div className="mt-4 h-3 w-1/3 rounded bg-[#EAE3D9]" />
                <div className="mt-3 h-4 w-3/4 rounded bg-[#EAE3D9]" />
                <div className="mt-3 h-4 w-1/4 rounded bg-[#EAE3D9]" />
              </div>
            ))
          ) : isError ? (
            <ProductGridState
              title="Products could not be loaded"
              description="Please try again in a moment."
            />
          ) : featuredProducts.length === 0 ? (
            <ProductGridState
              title="New discoveries are coming soon"
              description="There are no published products to display right now. Please check back soon."
            />
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {isError && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-[#29251F] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#514538]"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 rounded-full border border-[#CFC1AF] px-8 py-3.5 text-sm font-medium transition hover:border-[#29251F] hover:bg-[#29251F] hover:text-white"
          >
            View All Products <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Brand introduction */}
      <section className="border-y border-[#EAE3D9] bg-[#F5EFE6]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div className="aspect-[5/4] overflow-hidden rounded-3xl bg-[#E7D9C4]">
            <img
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1100&q=85"
              alt="A thoughtfully arranged collection"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <SectionHeading
              eyebrow="About MagicalStones"
              title="A thoughtful way to discover more."
              description="MagicalStones brings spiritual products and traditional essentials into one convenient shopping destination. Explore collections inspired by different traditions and lifestyles."
            />

            <ul className="space-y-4">
              {[
                "Explore spiritual and lifestyle products.",
                "Browse categories that make discovery easier.",
                "Find convenient ways to shop our collections.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEE2D0] text-sm text-[#956537]">
                    ✓
                  </span>
                  <span className="text-sm leading-6 text-[#6F6558]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#29251F] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#514538]"
            >
              Our Story <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final shopping CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#956537]">
          Your next discovery starts here
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl leading-tight sm:text-5xl">
          Find something meaningful today.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#777066] sm:text-base">
          Explore the collection and discover products that suit your
          interests, traditions and everyday lifestyle.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#29251F] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#514538]"
        >
          Start Shopping <span>↗</span>
        </Link>
      </section>
    </div>
  );
}
