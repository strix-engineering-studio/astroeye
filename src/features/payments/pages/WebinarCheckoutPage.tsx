"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  ShieldCheck,
  User,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { Checkbox } from "@/components/ui/checkbox";

import type { Webinar } from "@/features/webinars/types/webinar.types";

import {
  useCreateWebinarPaymentOrderMutation,
  useVerifyWebinarPaymentMutation,
} from "../hooks/usePayment";

import { loadRazorpay } from "@/lib/razorpay/loadRazorpay";

interface WebinarCheckoutPageProps {
  webinar: Webinar;
}

export function WebinarCheckoutPage({ webinar }: WebinarCheckoutPageProps) {
  const router = useRouter();

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentOrderMutation = useCreateWebinarPaymentOrderMutation();

  const verifyPaymentMutation = useVerifyWebinarPaymentMutation();

  const isPaid = webinar.isPaid;

  const amount = webinar.amount ?? 0;

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }, [amount]);

  const scheduledDate = useMemo(() => {
    return new Date(webinar.scheduledAt);
  }, [webinar.scheduledAt]);

  const formattedDate = scheduledDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = scheduledDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const handleCheckout = async () => {
    if (!acceptedTerms || isProcessing || !isPaid) {
      return;
    }

    try {
      setIsProcessing(true);

      /*
       * Create Razorpay order on the backend.
       *
       * Only send webinarId.
       *
       * The backend must determine the amount from
       * the Webinar document.
       */
      const checkout = await createPaymentOrderMutation.mutateAsync({
        webinarId: webinar.id,
      });

      /*
       * Load Razorpay Checkout.
       */
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error("Unable to load Razorpay Checkout");
      }

      /*
       * Open Razorpay Checkout.
       */
      const razorpay = new window.Razorpay({
        key: checkout.keyId,

        /*
         * Amount returned by backend.
         *
         * Razorpay expects the smallest currency unit.
         * Example:
         *
         * ₹499 -> 49900 paise
         */
        amount: checkout.amount,

        currency: checkout.currency,

        name: checkout.name,

        description: checkout.description,

        order_id: checkout.orderId,

        image: webinar.thumbnailUrl || undefined,

        prefill: {
          /*
           * Populate from authenticated user.
           */
          name: "",
          email: "",
          contact: "",
        },

        notes: {
          webinar_id: webinar.id,
        },

        theme: {
          color: "#000000",
        },

        modal: {
          confirm_close: true,
          escape: true,
          backdropclose: false,
          animation: true,
          ondismiss: () => {
            setIsProcessing(false);
          },
        },

        retry: {
          enabled: true,
          max_count: 2,
        },

        /*
         * Razorpay payment response.
         */
        handler: async (response) => {
          try {
            /*
             * Send Razorpay response to backend.
             *
             * Backend must verify the signature.
             */
            const result = await verifyPaymentMutation.mutateAsync({
              webinarId: webinar.id,

              razorpayPaymentId: response.razorpay_payment_id,

              razorpayOrderId: response.razorpay_order_id,

              razorpaySignature: response.razorpay_signature,
            });

            /*
             * Payment + registration completed.
             */
            if (result.success) {
              router.push(`/webinars/${webinar.id}/success`);
            }
          } catch (error) {
            console.error("Webinar payment verification failed:", error);

            setIsProcessing(false);
          }
        },
      });

      /*
       * Payment failure.
       */
      razorpay.on(
        "payment.failed",
        (response: RazorpayPaymentFailedResponse) => {
          console.error("Webinar payment failed:", response);

          setIsProcessing(false);
        },
      );

      /*
       * Open Razorpay.
       */
      razorpay.open();
    } catch (error) {
      console.error("Webinar checkout initialization failed:", error);

      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto flex h-16 max-w-7xl items-center px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-muted-foreground ml-auto flex items-center gap-2 text-sm">
            <Lock className="h-4 w-4" />
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Complete your registration
          </h1>

          <p className="text-muted-foreground mt-2">
            Register for this webinar by completing your payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Webinar */}
            <Card>
              <CardHeader>
                <CardTitle>Webinar Details</CardTitle>

                <CardDescription>
                  Review the webinar before continuing.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex gap-5">
                  {/* Thumbnail */}
                  <div className="bg-muted flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                    {webinar.thumbnailUrl ? (
                      <img
                        src={webinar.thumbnailUrl}
                        alt={webinar.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Video className="text-muted-foreground h-10 w-10" />
                    )}
                  </div>

                  {/* Information */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge variant="outline">{webinar.category}</Badge>

                      {webinar.isPaid ? (
                        <Badge>Paid Webinar</Badge>
                      ) : (
                        <Badge variant="secondary">Free Webinar</Badge>
                      )}

                      {webinar.isFeatured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold">{webinar.title}</h2>

                    <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-6">
                      {webinar.description}
                    </p>

                    {/* Speaker */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="bg-muted flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
                        {webinar.speakerImageUrl ? (
                          <img
                            src={webinar.speakerImageUrl}
                            alt={webinar.speakerName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="text-muted-foreground h-4 w-4" />
                        )}
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">Speaker</p>

                        <p className="text-sm font-medium">
                          {webinar.speakerName}
                        </p>

                        {webinar.speakerDesignation && (
                          <p className="text-muted-foreground text-xs">
                            {webinar.speakerDesignation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>

                <CardDescription>Webinar date and time.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-4">
                    <div className="bg-background flex h-10 w-10 items-center justify-center rounded-full">
                      <Calendar className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">Date</p>

                      <p className="text-sm font-medium">{formattedDate}</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-4">
                    <div className="bg-background flex h-10 w-10 items-center justify-center rounded-full">
                      <Clock className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">Starts At</p>

                      <p className="text-sm font-medium">{formattedTime}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Included */}
            <Card>
              <CardHeader>
                <CardTitle>What you&apos;ll get</CardTitle>

                <CardDescription>
                  Your webinar registration includes:
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <Feature
                    icon={<CheckCircle2 />}
                    title="Webinar registration"
                    description="Your registration will be confirmed after successful payment."
                  />

                  <Feature
                    icon={<Video />}
                    title="Live webinar access"
                    description="Receive access to the webinar after registration is confirmed."
                  />

                  <Feature
                    icon={<ShieldCheck />}
                    title="Secure payment"
                    description="Your payment is processed securely through Razorpay."
                  />

                  <Feature
                    icon={<User />}
                    title="Personal registration"
                    description="Your registration is associated with your MagicalStones account."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) =>
                      setAcceptedTerms(checked === true)
                    }
                  />

                  <label
                    htmlFor="terms"
                    className="cursor-pointer text-sm leading-6"
                  >
                    I agree to the webinar registration terms and understand
                    that my registration will be confirmed after successful
                    payment.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle>Registration Summary</CardTitle>

                <CardDescription>
                  Review your registration before payment.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Webinar summary */}
                <div className="flex gap-4">
                  <div className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md">
                    {webinar.thumbnailUrl ? (
                      <img
                        src={webinar.thumbnailUrl}
                        alt={webinar.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Video className="text-muted-foreground h-6 w-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold">
                      {webinar.title}
                    </p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {webinar.category}
                    </p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {webinar.speakerName}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Schedule */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>

                    <span className="text-right">
                      {scheduledDate.toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>

                    <span>{formattedTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Registration</span>

                    <span>{isPaid ? "Paid" : "Free"}</span>
                  </div>
                </div>

                <Separator />

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>

                  <span className="text-2xl font-bold">{formattedAmount}</span>
                </div>

                {/* Checkout */}
                <Button
                  className="h-12 w-full"
                  size="lg"
                  disabled={!acceptedTerms || isProcessing || !isPaid}
                  onClick={handleCheckout}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay {formattedAmount}
                    </>
                  )}
                </Button>

                {!acceptedTerms && (
                  <p className="text-muted-foreground text-center text-xs">
                    Accept the terms to continue.
                  </p>
                )}

                {!isPaid && (
                  <p className="text-muted-foreground text-center text-xs">
                    This webinar does not require payment.
                  </p>
                )}

                {/* Secure */}
                <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4" />
                  Secure payment via Razorpay
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-xs">
                Need help with your registration?
              </p>

              <Button
                variant="link"
                size="sm"
                className="h-auto px-1 text-xs"
                onClick={() => router.push("/support")}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex gap-4">
      <div className="text-primary mt-0.5 shrink-0">{icon}</div>

      <div>
        <p className="font-medium">{title}</p>

        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {description}
        </p>
      </div>
    </div>
  );
}

export default WebinarCheckoutPage;
