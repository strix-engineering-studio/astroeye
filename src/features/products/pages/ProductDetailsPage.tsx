
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import { useProductQuery } from "@/features/products/hooks/useProduct";

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

function ProductDetailsSkeleton() {
  return (
    <main className="min-h-screen animate-pulse bg-[#FCFAF6]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-4 w-40 rounded bg-[#EAE3D9]" />

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-[#EAE3D9]" />

          <div className="space-y-5 py-4">
            <div className="h-4 w-28 rounded bg-[#EAE3D9]" />
            <div className="h-10 w-3/4 rounded bg-[#EAE3D9]" />
            <div className="h-6 w-32 rounded bg-[#EAE3D9]" />
            <div className="h-20 rounded bg-[#EAE3D9]" />
            <div className="h-12 rounded-full bg-[#EAE3D9]" />
            <div className="h-12 rounded-full bg-[#EAE3D9]" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;
  const { data: product, isPending, isError, refetch } =
    useProductQuery(id);

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [actionError, setActionError] = useState("");

  if (isPending) {
    return <ProductDetailsSkeleton />;
  }

  if (isError) {
    return (
      <main className="min-h-[60vh] bg-[#FCFAF6] px-4 py-20 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-[#956537]" />

        <h1 className="mt-5 font-serif text-3xl text-[#29251F]">
          Unable to load product
        </h1>

        <p className="mt-3 text-sm text-[#777066]">
          Something went wrong while loading this product.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-7 rounded-full bg-[#29251F] px-7 py-3 text-sm font-medium text-white hover:bg-[#514538]"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!product || !product.isPublished) {
    return (
      <main className="min-h-[60vh] bg-[#FCFAF6] px-4 py-20 text-center">
        <Package className="mx-auto h-10 w-10 text-[#956537]" />

        <h1 className="mt-5 font-serif text-3xl text-[#29251F]">
          Product not found
        </h1>

        <p className="mt-3 text-sm text-[#777066]">
          This product may be unavailable or no longer published.
        </p>

        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#29251F] px-7 py-3 text-sm font-medium text-white hover:bg-[#514538]"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse products
        </Link>
      </main>
    );
  }

  const inStock = product.stockQuantity > 0;
  const maxQuantity = Math.max(0, product.stockQuantity);

  function addToCart() {
    if (!product || !inStock) return;

    setActionError("");

    try {
      // Basic local cart format. Connect this to your existing cart
      // service/context if your application already has one.
      const storageKey = "magicalstones-cart";
      const stored = localStorage.getItem(storageKey);
      const cart: Array<{
        productId: string;
        name: string;
        price: number;
        imageUrl?: string;
        quantity: number;
      }> = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(cart)) {
        throw new Error("Invalid cart data.");
      }

      const existing = cart.find(
        (item) => item.productId === product.id,
      );

      const nextQuantity = (existing?.quantity ?? 0) + quantity;

      if (nextQuantity > product.stockQuantity) {
        setActionError(
          `Only ${product.stockQuantity} unit(s) are currently available.`,
        );
        return;
      }

      if (existing) {
        existing.quantity = nextQuantity;
        existing.name = product.name;
        existing.price = product.price;
        existing.imageUrl = product.imageUrl;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        });
      }

      localStorage.setItem(storageKey, JSON.stringify(cart));

      window.dispatchEvent(
        new CustomEvent("magicalstones:cart-updated", {
          detail: { cart },
        }),
      );

      setAddedToCart(true);
    } catch {
      setActionError(
        "Unable to update your cart. Please try again.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#FCFAF6] text-[#29251F]">
      {/* Breadcrumb */}
      <div className="border-b border-[#EAE3D9]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 text-xs text-[#827565] sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-[#956537]">
            Home
          </Link>

          <ChevronRight className="h-3 w-3" />

          <Link href="/products" className="hover:text-[#956537]">
            Products
          </Link>

          <ChevronRight className="h-3 w-3" />

          <span className="truncate font-medium text-[#29251F]">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product details */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Link
          href="/products"
          className="mb-7 inline-flex items-center gap-2 text-sm text-[#776957] transition hover:text-[#956537]"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product image */}
          <div className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#EBE4DA] bg-[#F0E9DF]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 sm:p-8"
                  fetchPriority="high"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-[#956537]">
                  <Sparkles className="h-16 w-16" />
                  <span className="font-serif text-xl">
                    MagicalStones
                  </span>
                </div>
              )}

              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#E5D9C8] bg-[#FCFAF6]/95 px-3 py-2 text-xs font-medium text-[#74583A]">
                <Sparkles className="h-3.5 w-3.5" />
                MagicalStones Collection
              </span>
            </div>
          </div>

          {/* Product information */}
          <div className="min-w-0 lg:py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#956537]">
              Astrology & Spiritual Products
            </p>

            <h1 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-semibold tracking-tight">
                {formatPrice(product.price)}
              </span>

              {inStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7EDE2] px-3 py-1.5 text-xs font-medium text-[#45623B]">
                  <Check className="h-3.5 w-3.5" />
                  In stock
                </span>
              ) : (
                <span className="rounded-full bg-[#F6E6E2] px-3 py-1.5 text-xs font-medium text-[#994D3C]">
                  Out of stock
                </span>
              )}
            </div>

            <div className="mt-3 text-xs text-[#827565]">
              Inclusive of applicable taxes, as shown at checkout.
            </div>

            <div className="my-7 border-t border-[#EAE3D9]" />

            <div>
              <h2 className="text-sm font-semibold">Product description</h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#777066]">
                {product.description?.trim() ||
                  "Explore this product from the MagicalStones collection. Contact us if you need additional product details before purchasing."}
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-[#EBE4DA] bg-white p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Package className="mt-0.5 h-5 w-5 shrink-0 text-[#956537]" />

                <div>
                  <p className="text-sm font-medium">
                    Availability
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#827565]">
                    {inStock
                      ? product.stockQuantity <= 5
                        ? `Only ${product.stockQuantity} unit(s) available.`
                        : "Available for purchase while stocks last."
                      : "This product is currently unavailable."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 border-t border-[#EEE6DC] pt-4">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#956537]" />

                <div>
                  <p className="text-sm font-medium">
                    Delivery information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#827565]">
                    Delivery options and estimated dates can be confirmed
                    during checkout.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 border-t border-[#EEE6DC] pt-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#956537]" />

                <div>
                  <p className="text-sm font-medium">
                    Secure shopping
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#827565]">
                    Review your order details before completing payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mt-7">
              <label className="mb-3 block text-sm font-medium">
                Quantity
              </label>

              <div className="inline-flex h-12 items-center rounded-full border border-[#E5D9C8] bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={!inStock || quantity <= 1}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#514538] hover:bg-[#F5EFE6] disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span
                  aria-live="polite"
                  className="min-w-10 text-center text-sm font-medium"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={!inStock || quantity >= maxQuantity}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(maxQuantity, current + 1),
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#514538] hover:bg-[#F5EFE6] disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Purchase actions */}
            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                disabled={!inStock}
                onClick={addToCart}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#29251F] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#514538] disabled:cursor-not-allowed disabled:bg-[#B7B0A7]"
              >
                <ShoppingBag className="h-4 w-4" />
                {inStock ? "Add to cart" : "Out of stock"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/products")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D7C7B1] px-6 py-4 text-sm font-medium text-[#514538] transition hover:bg-white"
              >
                More products
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {addedToCart && (
              <div
                role="status"
                className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D7E3CF] bg-[#F0F5EC] p-4"
              >
                <p className="text-sm text-[#45623B]">
                  {quantity} × {product.name} added to your cart.
                </p>

                <Link
                  href="/cart"
                  className="text-sm font-semibold text-[#45623B] underline underline-offset-4"
                >
                  View cart
                </Link>
              </div>
            )}

            {actionError && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {actionError}
              </p>
            )}

            <p className="mt-5 text-xs leading-6 text-[#827565]">
              Product availability can change. Final stock validation and
              pricing must be confirmed by the server when placing an order.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
