
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const purchaseId = searchParams.get("id");
  const paymentId = searchParams.get("paymentId");

  const isResource = type === "resource";
  const isWebinar = type === "webinar";

  if (
    (!isResource && !isWebinar) ||
    !purchaseId ||
    !paymentId
  ) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-12">
        <section className="w-full rounded-2xl border p-8 text-center">
          <h1 className="text-xl font-semibold">
            Payment details unavailable
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We could not load the payment confirmation details.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-primary-foreground"
          >
            Return home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-lg items-center px-4 py-12">
      <section className="w-full rounded-2xl border bg-background p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-8"
            aria-hidden="true"
          >
            <path
              d="m5 12 4 4L19 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mt-6 text-sm font-medium text-green-700">
          PAYMENT CONFIRMED
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Payment successful
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {isResource
            ? "Your resource purchase has been confirmed."
            : "Your webinar payment and registration have been confirmed."}
        </p>

        <div className="mt-6 rounded-xl bg-muted/50 p-4 text-left">
          <p className="text-xs text-muted-foreground">
            Payment reference
          </p>
          <p className="mt-1 break-all text-sm font-medium">
            {paymentId}
          </p>

          <p className="mt-4 text-xs text-muted-foreground">
            Purchase ID
          </p>
          <p className="mt-1 break-all text-sm font-medium">
            {purchaseId}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isResource && (
            <Link
              href={`/resources/${encodeURIComponent(purchaseId)}`}
              className="rounded-lg bg-[#0038FD] px-5 py-3 font-medium text-white hover:bg-[#002ed0]"
            >
              Access resource
            </Link>
          )}

          {isWebinar && (
            <Link
              href="/webinars"
              className="rounded-lg bg-[#0038FD] px-5 py-3 font-medium text-white hover:bg-[#002ed0]"
            >
              Explore webinars
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          Loading payment confirmation...
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
