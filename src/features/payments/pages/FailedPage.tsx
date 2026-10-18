
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailedContent() {
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const purchaseId = searchParams.get("id");
  const reason = searchParams.get("reason");

  const validPurchase =
    (type === "resource" || type === "webinar") &&
    Boolean(purchaseId);

  const checkoutUrl = validPurchase
    ? `/checkout?type=${type}&id=${encodeURIComponent(purchaseId!)}`
    : "/";

  const title =
    reason === "cancelled"
      ? "Payment cancelled"
      : reason === "verification"
        ? "Payment confirmation pending"
        : "Payment unsuccessful";

  const description =
    reason === "cancelled"
      ? "You closed the payment window before completing the checkout."
      : reason === "verification"
        ? "We could not confirm your payment yet. If money was deducted, check your payment status before trying again."
        : "We could not complete this payment. Check the transaction status before retrying.";

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-lg items-center px-4 py-12">
      <section className="w-full rounded-2xl border bg-background p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-8"
            aria-hidden="true"
          >
            <path
              d="m18 6-12 12M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mt-6 text-sm font-medium text-red-700">
          PAYMENT NOT CONFIRMED
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {purchaseId && (
          <div className="mt-6 rounded-xl bg-muted/50 p-4 text-left">
            <p className="text-xs text-muted-foreground">
              Purchase ID
            </p>
            <p className="mt-1 break-all text-sm font-medium">
              {purchaseId}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {validPurchase && reason !== "verification" && (
            <Link
              href={checkoutUrl}
              className="rounded-lg bg-[#0038FD] px-5 py-3 font-medium text-white hover:bg-[#002ed0]"
            >
              Try again
            </Link>
          )}

          {reason === "verification" && (
            <Link
              href="/account/orders"
              className="rounded-lg bg-[#0038FD] px-5 py-3 font-medium text-white hover:bg-[#002ed0]"
            >
              Check payment status
            </Link>
          )}

          <Link
            href="/"
            className="rounded-lg border px-5 py-3 font-medium"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          Loading payment status...
        </main>
      }
    >
      <FailedContent />
    </Suspense>
  );
}
