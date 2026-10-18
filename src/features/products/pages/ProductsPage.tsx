
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";


import type { Product } from "@/features/products/types/product.type";
import { useProductsQuery } from "../hooks/useProduct";

const PAGE_SIZE = 12;

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "" },
  { label: "Gemstones", value: "gemstones" },
  { label: "Rudraksha", value: "rudraksha" },
  { label: "Spiritual Jewellery", value: "spiritual-jewellery" },
  { label: "Puja Essentials", value: "puja-essentials" },
  { label: "Idols & Murtis", value: "idols-and-murtis" },
  { label: "Yantras", value: "yantras" },
  { label: "Incense & Dhoop", value: "incense-and-dhoop" },
  { label: "Books", value: "books" },
];

const TYPE_OPTIONS = [
  { label: "All types", value: "" },
  { label: "Gemstone", value: "gemstone" },
  { label: "Rudraksha", value: "rudraksha" },
  { label: "Bracelet", value: "bracelet" },
  { label: "Mala", value: "mala" },
  { label: "Idol", value: "idol" },
  { label: "Yantra", value: "yantra" },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "featured" },
  { label: "Newest first", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
];

type StoreProduct = Product & {
  slug?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  images?: string[];
  category?: string;
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  type?: string;
  productType?: string;
  price?: number;
  originalPrice?: number;
  compareAtPrice?: number;
  stock?: number;
  quantity?: number;
  isAvailable?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isFeatured?: boolean;
};

function normalize(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getField(
  product: StoreProduct,
  field: string,
): unknown {
  return (product as unknown as Record<string, unknown>)[field];
}

function getPrice(product: StoreProduct): number {
  const value = product.price;

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : 0;
}

function getImage(product: StoreProduct): string | undefined {
  if (product.imageUrl) return product.imageUrl;
  if (product.image) return product.image;
  if (product.thumbnail) return product.thumbnail;

  return product.images?.[0];
}

function getCategoryValues(product: StoreProduct): string[] {
  return [
    product.category,
    product.categoryName,
    product.categorySlug,
    product.categoryId,
  ]
    .filter((value): value is string => typeof value === "string")
    .map(normalize);
}

function getTypeValues(product: StoreProduct): string[] {
  return [
    product.type,
    product.productType,
  ]
    .filter((value): value is string => typeof value === "string")
    .map(normalize);
}

function getTimestamp(value: unknown): number {
  if (value instanceof Date) return value.getTime();

  if (typeof value === "string") {
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  // Firestore Timestamp-like object.
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    const date = value.toDate();

    if (date instanceof Date) return date.getTime();
  }

  return 0;
}

function getProductHref(product: StoreProduct): string {
  return `/products/${encodeURIComponent(product.id)}`;
}

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

function ProductCard({ product }: { product: StoreProduct }) {
  const image = getImage(product);
  const price = getPrice(product);

  const originalPrice =
    typeof product.compareAtPrice === "number"
      ? product.compareAtPrice
      : product.originalPrice;

  const hasDiscount =
    typeof originalPrice === "number" && originalPrice > price;

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
            <div className="flex h-full items-center justify-center text-5xl text-[#956537]">
              ✧
            </div>
          )}
        </div>

        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FCFAF6] px-3 py-1.5 text-[10px] font-semibold text-[#74583A]">
            Featured
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FCFAF6] text-lg transition group-hover:bg-[#29251F] group-hover:text-white">
          ↗
        </span>
      </Link>

      <div className="mt-4">
        <p className="text-xs capitalize text-[#9B8B77]">
          {product.categoryName ||
            product.category ||
            product.productType ||
            product.type ||
            "MagicalStones"}
        </p>

        <Link
          href={getProductHref(product)}
          className="mt-1 block text-sm font-medium leading-6 text-[#29251F] transition hover:text-[#956537] sm:text-base"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#29251F]">
            {formatPrice(price)}
          </span>

          {hasDiscount && (
            <span className="text-xs text-[#9B9185] line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/4.6] rounded-2xl bg-[#EAE3D9]" />
      <div className="mt-4 h-3 w-1/3 rounded bg-[#EAE3D9]" />
      <div className="mt-3 h-4 w-3/4 rounded bg-[#EAE3D9]" />
      <div className="mt-3 h-4 w-1/4 rounded bg-[#EAE3D9]" />
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const type = searchParams.get("type") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const pageParam = Number(searchParams.get("page") ?? "1");
  const minPriceParam = searchParams.get("minPrice") ?? "";
  const maxPriceParam = searchParams.get("maxPrice") ?? "";

  const page =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const minPrice =
    minPriceParam !== "" && Number.isFinite(Number(minPriceParam))
      ? Math.max(0, Number(minPriceParam))
      : undefined;

  const maxPrice =
    maxPriceParam !== "" && Number.isFinite(Number(maxPriceParam))
      ? Math.max(0, Number(maxPriceParam))
      : undefined;

  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setMinPriceInput(minPriceParam);
    setMaxPriceInput(maxPriceParam);
  }, [minPriceParam, maxPriceParam]);

  // Existing hook supports all, categoryId, and search.
  // Search is passed to the service; category/type/price are
  // additionally filtered below using the returned product fields.
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useProductsQuery({
    all: false,
    search: search.trim() || undefined,
  });

  const products = (data ?? []) as StoreProduct[];

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) => product.isPublished === true,
    );

    // Apply category slug/name filtering.
    if (category) {
      const normalizedCategory = normalize(category);

      result = result.filter((product) =>
        getCategoryValues(product).includes(normalizedCategory),
      );
    }

    // Apply product type filtering.
    if (type) {
      const normalizedType = normalize(type);

      result = result.filter((product) =>
        getTypeValues(product).includes(normalizedType),
      );
    }

    // Client-side text filter keeps search usable even when the
    // service's search implementation matches only some fields.
    if (search.trim()) {
      const term = normalize(search).replace(/-/g, " ");

      result = result.filter((product) => {
        const searchable = [
          product.name,
          product.description,
          product.category,
          product.categoryName,
          product.categorySlug,
          product.type,
          product.productType,
        ]
          .filter((value): value is string => typeof value === "string")
          .join(" ")
          .toLowerCase();

        return searchable.includes(term);
      });
    }

    if (minPrice !== undefined) {
      result = result.filter(
        (product) => getPrice(product) >= minPrice,
      );
    }

    if (maxPrice !== undefined) {
      result = result.filter(
        (product) => getPrice(product) <= maxPrice,
      );
    }

    const sorted = [...result];

    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => getPrice(a) - getPrice(b));
        break;

      case "price-desc":
        sorted.sort((a, b) => getPrice(b) - getPrice(a));
        break;

      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "newest":
        sorted.sort(
          (a, b) =>
            getTimestamp(b.createdAt) - getTimestamp(a.createdAt),
        );
        break;

      case "featured":
      default:
        sorted.sort(
          (a, b) =>
            Number(Boolean(b.isFeatured)) -
            Number(Boolean(a.isFeatured)),
        );
        break;
    }

    return sorted;
  }, [
    products,
    category,
    type,
    search,
    sort,
    minPrice,
    maxPrice,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function updateParams(
    updates: Record<string, string | undefined>,
    resetPage = true,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if (resetPage && !("page" in updates)) {
      params.delete("page");
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateParams({
      search: searchInput.trim(),
    });
  }

  function applyPriceFilter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const min = minPriceInput.trim();
    const max = maxPriceInput.trim();

    if (
      (min && (!Number.isFinite(Number(min)) || Number(min) < 0)) ||
      (max && (!Number.isFinite(Number(max)) || Number(max) < 0))
    ) {
      return;
    }

    if (min && max && Number(min) > Number(max)) {
      return;
    }

    updateParams({
      minPrice: min,
      maxPrice: max,
    });
  }

  function clearFilters() {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");

    router.push(pathname, { scroll: false });
  }

  const hasFilters = Boolean(
    category ||
      type ||
      search ||
      minPriceParam ||
      maxPriceParam,
  );

  const selectedCategory = CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  );

  return (
    <main className="min-h-screen bg-[#FCFAF6] text-[#29251F]">
      {/* Page introduction */}
      <section className="border-b border-[#EAE3D9] bg-[#F5EFE6]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#956537]">
            MagicalStones collection
          </p>

          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            {selectedCategory?.label ||
              (type
                ? `${type.replace(/-/g, " ")} Products`
                : search
                  ? "Search Results"
                  : "Shop All Products")}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#777066] sm:text-base">
            Discover gemstones, Rudraksha, spiritual jewellery and
            meaningful essentials for your traditions and everyday life.
          </p>

          <nav
            aria-label="Breadcrumb"
            className="mt-5 flex items-center gap-2 text-xs text-[#827565]"
          >
            <Link href="/" className="hover:text-[#956537]">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#956537]">
              Products
            </Link>
            {category && (
              <>
                <span>/</span>
                <span className="capitalize">
                  {category.replace(/-/g, " ")}
                </span>
              </>
            )}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Search and toolbar */}
        <div className="flex flex-col gap-4">
          <form
            onSubmit={submitSearch}
            role="search"
            className="flex h-12 items-center rounded-full border border-[#E5D9C8] bg-white px-4 focus-within:border-[#B28A5B]"
          >
            <Search className="h-4 w-4 shrink-0 text-[#8D7B65]" />

            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search products, gemstones, Rudraksha..."
              aria-label="Search products"
              className="ml-3 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A49A8D]"
            />

            {searchInput && (
              <button
                type="button"
                aria-label="Clear search input"
                onClick={() => setSearchInput("")}
                className="mr-2 text-[#827565] hover:text-[#29251F]"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              className="rounded-full bg-[#29251F] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#514538]"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#777066]" aria-live="polite">
              {isPending
                ? "Loading products..."
                : `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "product" : "products"
                  } found`}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((value) => !value)}
                aria-expanded={filtersOpen}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E5D9C8] bg-white px-4 text-sm transition hover:border-[#C8AD87]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              <label className="flex h-10 items-center gap-2 rounded-full border border-[#E5D9C8] bg-white px-3">
                <span className="text-xs text-[#827565]">Sort:</span>
                <select
                  value={sort}
                  onChange={(event) =>
                    updateParams({ sort: event.target.value })
                  }
                  aria-label="Sort products"
                  className="max-w-[160px] bg-transparent text-xs font-medium outline-none sm:max-w-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Filters */}
        {filtersOpen && (
          <div className="mt-5 rounded-2xl border border-[#E5D9C8] bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl">Filter products</h2>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-2 text-[#827565] hover:bg-[#F5EFE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-[#65594B]">
                  Category
                </span>

                <select
                  value={category}
                  onChange={(event) =>
                    updateParams({ category: event.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-[#E5D9C8] bg-[#FCFAF6] px-3 text-sm outline-none focus:border-[#B28A5B]"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-[#65594B]">
                  Product type
                </span>

                <select
                  value={type}
                  onChange={(event) =>
                    updateParams({ type: event.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-[#E5D9C8] bg-[#FCFAF6] px-3 text-sm outline-none focus:border-[#B28A5B]"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <form
                onSubmit={applyPriceFilter}
                className="sm:col-span-2 lg:col-span-1"
              >
                <span className="mb-2 block text-xs font-medium text-[#65594B]">
                  Price range (₹)
                </span>

                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={minPriceInput}
                    onChange={(event) =>
                      setMinPriceInput(event.target.value)
                    }
                    placeholder="Min"
                    aria-label="Minimum price"
                    className="h-11 min-w-0 w-full rounded-xl border border-[#E5D9C8] bg-[#FCFAF6] px-3 text-sm outline-none focus:border-[#B28A5B]"
                  />

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={maxPriceInput}
                    onChange={(event) =>
                      setMaxPriceInput(event.target.value)
                    }
                    placeholder="Max"
                    aria-label="Maximum price"
                    className="h-11 min-w-0 w-full rounded-xl border border-[#E5D9C8] bg-[#FCFAF6] px-3 text-sm outline-none focus:border-[#B28A5B]"
                  />

                  <button
                    type="submit"
                    aria-label="Apply price filter"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#29251F] text-white hover:bg-[#514538]"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE6DC] pt-4">
              <p className="text-xs text-[#827565]">
                Filters are reflected in the page URL.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-[#956537] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Active filters */}
        {hasFilters && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {category && (
              <button
                type="button"
                onClick={() => updateParams({ category: "" })}
                className="inline-flex items-center gap-2 rounded-full bg-[#F1E7D9] px-3 py-2 text-xs capitalize text-[#74583A]"
              >
                Category: {category.replace(/-/g, " ")}
                <X className="h-3 w-3" />
              </button>
            )}

            {type && (
              <button
                type="button"
                onClick={() => updateParams({ type: "" })}
                className="inline-flex items-center gap-2 rounded-full bg-[#F1E7D9] px-3 py-2 text-xs capitalize text-[#74583A]"
              >
                Type: {type.replace(/-/g, " ")}
                <X className="h-3 w-3" />
              </button>
            )}

            {search && (
              <button
                type="button"
                onClick={() => updateParams({ search: "" })}
                className="inline-flex items-center gap-2 rounded-full bg-[#F1E7D9] px-3 py-2 text-xs text-[#74583A]"
              >
                Search: {search}
                <X className="h-3 w-3" />
              </button>
            )}

            {(minPriceParam || maxPriceParam) && (
              <button
                type="button"
                onClick={() =>
                  updateParams({ minPrice: "", maxPrice: "" })
                }
                className="inline-flex items-center gap-2 rounded-full bg-[#F1E7D9] px-3 py-2 text-xs text-[#74583A]"
              >
                Price: {minPriceParam || "0"}–{maxPriceParam || "Any"}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* Product grid */}
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
          {isPending &&
            Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}

          {isError && (
            <div className="col-span-full rounded-2xl border border-[#EBE4DA] bg-white px-5 py-14 text-center">
              <h2 className="font-serif text-2xl">
                Products could not be loaded
              </h2>

              <p className="mt-3 text-sm text-[#777066]">
                Please check your connection and try again.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 rounded-full bg-[#29251F] px-6 py-3 text-sm font-medium text-white hover:bg-[#514538]"
              >
                Try again
              </button>
            </div>
          )}

          {!isPending &&
            !isError &&
            paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

          {!isPending && !isError && paginatedProducts.length === 0 && (
            <div className="col-span-full rounded-2xl border border-[#EBE4DA] bg-white px-5 py-14 text-center">
              <div className="text-4xl text-[#956537]">✧</div>

              <h2 className="mt-4 font-serif text-2xl">
                No products found
              </h2>

              <p className="mt-3 text-sm text-[#777066]">
                Try another search or remove some filters to see more
                products.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-[#29251F] px-6 py-3 text-sm font-medium text-white hover:bg-[#514538]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isPending && !isError && filteredProducts.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#EAE3D9] pt-6">
            <p className="text-xs text-[#827565]">
              Showing{" "}
              {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(
                currentPage * PAGE_SIZE,
                filteredProducts.length,
              )}{" "}
              of {filteredProducts.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() =>
                  updateParams(
                    { page: String(currentPage - 1) },
                    false,
                  )
                }
                className="flex h-10 items-center gap-1 rounded-full border border-[#E5D9C8] px-4 text-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <span className="px-2 text-sm text-[#65594B]">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  updateParams(
                    { page: String(currentPage + 1) },
                    false,
                  )
                }
                className="flex h-10 items-center gap-1 rounded-full border border-[#E5D9C8] px-4 text-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
