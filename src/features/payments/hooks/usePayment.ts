import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import paymentServices from "../services/paymentServices";

import type {
  CreateResourceCheckoutInput,
  VerifyResourcePaymentInput,
  CreateWebinarPaymentOrderInput,
  VerifyWebinarPaymentInput,
} from "../types/razorpay.types";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";

/**
 * Safely extract an error message.
 */
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
};

/**
 * ============================================================
 * RESOURCE PAYMENT
 * ============================================================
 */

/**
 * Create Razorpay order for a resource checkout.
 *
 * The frontend sends only the resource ID.
 *
 * The backend is responsible for:
 * - validating the resource
 * - checking premium status
 * - determining the price
 * - creating the Razorpay order
 */
export const useCreateResourceCheckoutMutation = () => {
  return useMutation({
    mutationFn: (data: CreateResourceCheckoutInput) => {
      return paymentServices.createResourceCheckout(data);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Unable to start resource checkout"));
    },
  });
};

/**
 * Verify Razorpay payment for a resource.
 *
 * The backend must:
 * - validate the Razorpay order
 * - verify the Razorpay signature
 * - verify payment state
 * - grant resource access
 */
export const useVerifyResourcePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyResourcePaymentInput) => {
      return paymentServices.verifyResourcePayment(data);
    },

    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || "Resource payment verification failed");

        return;
      }

      /*
       * Refresh the resource so the UI reflects
       * the latest access/purchase state.
       */
      await queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.RESOURCES, result.resourceId],
      });

      /*
       * Refresh resource-related queries.
       */
      await queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.RESOURCES],
      });

      toast.success("Payment successful. Resource access granted.");
    },

    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "Resource payment verification failed"),
      );
    },
  });
};

/**
 * ============================================================
 * WEBINAR PAYMENT
 * ============================================================
 */

/**
 * Create Razorpay order for a paid webinar.
 *
 * The frontend sends only the webinar ID.
 *
 * The backend is responsible for:
 * - validating the webinar
 * - checking isPaid
 * - determining webinar.amount
 * - checking registration availability
 * - checking existing registration
 * - creating the Razorpay order
 */
export const useCreateWebinarPaymentOrderMutation = () => {
  return useMutation({
    mutationFn: (data: CreateWebinarPaymentOrderInput) => {
      return paymentServices.createWebinarPaymentOrder(data);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Unable to start webinar checkout"));
    },
  });
};

/**
 * Verify Razorpay payment for a webinar.
 *
 * The backend must:
 * - validate the Razorpay order
 * - verify the Razorpay signature
 * - verify payment state
 * - create/update WebinarRegistration
 * - set paymentStatus = PAID
 * - set registrationStatus = REGISTERED
 */
export const useVerifyWebinarPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyWebinarPaymentInput) => {
      return paymentServices.verifyWebinarPayment(data);
    },

    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || "Webinar payment verification failed");

        return;
      }

      /*
       * Refresh the webinar itself.
       *
       * This is important because registeredCount
       * may have changed.
       */
      await queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.WEBINARS, result.webinarId],
      });

      /*
       * Refresh webinar lists/details.
       */
      await queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.WEBINARS],
      });

      /*
       * If you have a registrations query,
       * invalidate it here.
       */
      await queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.WEBINAR_REGISTRATIONS, result.webinarId],
      });

      toast.success("Payment successful. Webinar registration confirmed.");
    },

    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "Webinar payment verification failed"),
      );
    },
  });
};
