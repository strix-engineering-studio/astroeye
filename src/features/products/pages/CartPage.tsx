
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

const CART_STORAGE_KEY = "magicalstones-cart";
const CART_UPDATED_EVENT = "magicalstones:cart-updated";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

function readCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.productId === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    window.dispatchEvent(
      new CustomEvent(CART_UPDATED_EVENT, {
        detail: { cart },
      }),
    );
  } catch {
    // Storage can be unavailable or full.
  }
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setIsLoaded(true);

    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ cart?: CartItem[] }>;

      if (Array.isArray(customEvent.detail?.cart)) {
        setCart(customEvent.detail.cart);
      } else {
        setCart(readCart());
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY || event.key === null) {
        setCart(readCart());
      }
    };

    window.addEventListener(
      CART_UPDATED_EVENT,
      handleCartUpdate,
    );
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        CART_UPDATED_EVENT,
        handleCartUpdate,
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateCart = useCallback((nextCart: CartItem[]) => {
    setCart(nextCart);
    saveCart(nextCart);
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    updateCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    updateCart(
      cart.filter((item) => item.productId !== productId),
    );
  };

  const clearCart = () => {
    updateCart([]);
  };

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#FCFAF6] px-4 py-16">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-56 rounded bg-[#EAE3D9]" />
          <div className="mt-8 h-64 rounded-2xl bg-[#F0E9DF]" />
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#FCFAF6] px-4 py-16 text-[#29251F] sm:py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F1E7D9]">
            <ShoppingBag
              className="h-8 w-8 text-[#956537]"
              strokeWidth={1.5}
            />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#956537]">
            Your shopping bag
          </p>

          <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
            Your cart is waiting
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-[#777066]">
            Discover gemstones, Rudraksha, spiritual jewellery
            and meaningful essentials for your collection.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#29251F] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#514538]"
          >
            Explore products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFAF6] text-[#29251F]">
      {/* Page header */}
      <section className="border-b border-[#EAE3D9] bg-[#F5EFE6]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-[#827565] transition hover:text-[#956537]"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#956537]">
            MagicalStones
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl">
                Your Shopping Bag
              </h1>

              <p className="mt-3 text-sm text-[#777066]">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-2 text-sm text-[#827565] transition hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear cart
            </button>
          </div>
        </div>
      </section>

      {/* Cart content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Items */}
          <div className="min-w-0">
            <div className="hidden grid-cols-[minmax(0,1fr)_110px_100px_36px] gap-4 border-b border-[#EAE3D9] pb-4 text-xs font-medium uppercase tracking-wider text-[#827565] sm:grid">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            <div className="divide-y divide-[#EAE3D9]">
              {cart.map((item) => (
                <article
                  key={item.productId}
                  className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_110px_100px_36px] sm:items-center sm:gap-4 sm:py-6"
                >
                  {/* Product details */}
                  <div className="contents">
                    <div className="flex min-w-0 gap-4 sm:items-center">
                      <Link
                        href={`/products/${encodeURIComponent(item.productId)}`}
                        className="h-28 w-[88px] shrink-0 overflow-hidden rounded-xl bg-[#F0E9DF] sm:h-28 sm:w-24"
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-3xl text-[#956537]">
                            ✧
                          </div>
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-col items-start py-1">
                        <Link
                          href={`/products/${encodeURIComponent(item.productId)}`}
                          className="line-clamp-2 text-sm font-medium leading-6 transition hover:text-[#956537] sm:text-base"
                        >
                          {item.name}
                        </Link>

                        <p className="mt-2 text-sm text-[#827565]">
                          {formatPrice(item.price)} each
                        </p>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs text-[#827565] transition hover:text-red-700 sm:hidden"
                        >
                          <X className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-start-2 row-start-2 flex items-center justify-start sm:col-start-auto sm:row-start-auto sm:justify-center">
                    <div className="inline-flex h-10 items-center rounded-full border border-[#E5D9C8] bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1,
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease ${item.name} quantity`}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F5EFE6] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span
                        className="min-w-7 text-center text-sm tabular-nums"
                        aria-label="Quantity"
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1,
                          )
                        }
                        aria-label={`Increase ${item.name} quantity`}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F5EFE6]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="col-start-2 row-start-3 text-left sm:col-start-auto sm:row-start-auto sm:text-right">
                    <span className="text-sm font-semibold tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove desktop */}
                  <div className="hidden justify-end sm:flex">
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[#827565] transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 border-t border-[#EAE3D9] pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#956537] transition hover:text-[#29251F]"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <aside className="rounded-2xl border border-[#E5D9C8] bg-white p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="font-serif text-2xl">Order Summary</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#777066]">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span className="font-medium tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-[#777066]">Shipping</span>
                <span className="text-right text-xs leading-5 text-[#827565]">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-[#EAE3D9] pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">Estimated total</span>
                  <span className="text-lg font-semibold tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#827565]">
                  Shipping charges and applicable taxes, if any,
                  will be confirmed at checkout.
                </p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#29251F] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#514538]"
            >
              Proceed to checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F7F3EC] p-4">
              <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-[#956537]" />

              <p className="text-xs leading-5 text-[#777066]">
                Your order and payment details will be confirmed
                during checkout.
              </p>
            </div>

            <p className="mt-4 text-center text-xs text-[#9B9185]">
              Questions about an item? Contact our customer support.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
