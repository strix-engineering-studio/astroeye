"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Download,
  FileText,
  Lock,
  ShieldCheck,
  Tag,
  User,
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

import { Resource } from "@/features/resources";

import { loadRazorpay } from "@/lib/razorpay/loadRazorpay";
import {
  useCreateResourceCheckoutMutation,
  useVerifyResourcePaymentMutation,
} from "../hooks/usePayment";

interface ResourceCheckoutPageProps {
  resource: Resource;
}

export function ResourceCheckoutPage({ resource }: ResourceCheckoutPageProps) {
  const router = useRouter();

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const createCheckoutMutation = useCreateResourceCheckoutMutation();

  const verifyPaymentMutation = useVerifyResourcePaymentMutation();

  const isPremium = resource.isPremium;

  /*
   * This is ONLY for display.
   *
   * The backend response is the authoritative amount.
   */
  const displayPrice = resource.price ?? 0;

  const formattedDisplayPrice = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(displayPrice);
  }, [displayPrice]);

  const handleCheckout = async () => {
    if (!acceptedTerms || isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      /*
       * 1. Ask backend to create Razorpay order.
       *
       * DO NOT create the Razorpay order here
       * using the Razorpay secret.
       */
      const checkout = await createCheckoutMutation.mutateAsync({
        resourceId: resource.id,
      });

      /*
       * 2. Load Razorpay Checkout script.
       */
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error("Unable to load Razorpay Checkout");
      }

      /*
       * 3. Open Razorpay Checkout.
       */
      const razorpay = new window.Razorpay({
        key: checkout.keyId,

        /*
         * Razorpay expects amount in the smallest
         * currency unit, e.g. INR paise.
         */
        amount: checkout.amount,

        currency: checkout.currency,

        name: checkout.name,

        description: checkout.description,

        order_id: checkout.orderId,

        image: resource.thumbnail || undefined,

        prefill: {
          /*
           * Populate these from your authenticated
           * user profile when available.
           */
          name: "",
          email: "",
          contact: "",
        },

        notes: {
          resource_id: resource.id,
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
         * 4. Razorpay returns payment details.
         *
         * These values MUST be verified on the backend.
         */
        handler: async (response) => {
          try {
            const result = await verifyPaymentMutation.mutateAsync({
              resourceId: resource.id,

              razorpayPaymentId: response.razorpay_payment_id,

              razorpayOrderId: response.razorpay_order_id,

              razorpaySignature: response.razorpay_signature,
            });

            /*
             * 5. Only after backend verification
             * redirect to the success page.
             */
            if (result.success) {
              router.push(`/resources/${resource.id}/success`);
            }
          } catch (error) {
            console.error("Razorpay verification failed:", error);

            setIsProcessing(false);
          }
        },
      });

      /*
       * Razorpay error event.
       */
      razorpay.on(
        "payment.failed",
        (response: RazorpayPaymentFailedResponse) => {
          console.error("Razorpay payment failed:", response);

          setIsProcessing(false);
        },
      );

      /*
       * Must be opened as part of the user interaction.
       */
      razorpay.open();
    } catch (error) {
      console.error("Checkout initialization failed:", error);

      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Complete your purchase
          </h1>

          <p className="text-muted-foreground mt-2">
            Get access to this resource after completing your payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource</CardTitle>

                <CardDescription>
                  Review the resource before continuing.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex gap-5">
                  <div className="bg-muted flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                    {resource.thumbnail ? (
                      <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileText className="text-muted-foreground h-10 w-10" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge variant="outline">{resource.category}</Badge>

                      <Badge variant="secondary">{resource.fileType}</Badge>

                      {isPremium && (
                        <Badge className="gap-1">
                          <Crown className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold">{resource.title}</h2>

                    <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-6">
                      {resource.description}
                    </p>

                    <div className="text-muted-foreground mt-4 flex flex-wrap gap-5 text-sm">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        {resource.downloads.toLocaleString()} downloads
                      </div>

                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />

                        {resource.category}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What you&apos;ll get</CardTitle>

                <CardDescription>
                  Your purchase includes the following.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <Feature
                    icon={<CheckCircle2 />}
                    title="Instant access"
                    description="Access the resource immediately after successful payment."
                  />

                  <Feature
                    icon={<Download />}
                    title="Resource download"
                    description={`Download the ${resource.fileType} resource from your account.`}
                  />

                  <Feature
                    icon={<ShieldCheck />}
                    title="Secure purchase"
                    description="Your payment is processed through Razorpay."
                  />

                  <Feature
                    icon={<User />}
                    title="Account access"
                    description="Your purchase will be associated with your account."
                  />
                </div>
              </CardContent>
            </Card>

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
                    I agree to the terms of purchase and understand that access
                    will be granted after successful payment.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-6 lg:h-fit">
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle>Order Summary</CardTitle>

                <CardDescription>
                  Review your order before payment.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                <div className="flex gap-4">
                  <div className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md">
                    {resource.thumbnail ? (
                      <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileText className="text-muted-foreground h-6 w-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold">
                      {resource.title}
                    </p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {resource.fileType}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Resource</span>

                    <span>{formattedDisplayPrice}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Access</span>

                    <span>{isPremium ? "Premium" : "Free"}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>

                    <span className="text-2xl font-bold">
                      {formattedDisplayPrice}
                    </span>
                  </div>
                </div>

                <Button
                  className="h-12 w-full"
                  size="lg"
                  disabled={!acceptedTerms || isProcessing || !isPremium}
                  onClick={handleCheckout}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay Now
                    </>
                  )}
                </Button>

                {!acceptedTerms && (
                  <p className="text-muted-foreground text-center text-xs">
                    Accept the terms to continue.
                  </p>
                )}

                <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4" />
                  Secure payment via Razorpay
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-xs">
                Need help with your purchase?
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

export default ResourceCheckoutPage;
