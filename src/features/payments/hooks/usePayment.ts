import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import paymentServices from "../services/paymentServices";
import type { CreatePaymentOrderInput, PaymentFilters, VerifyPaymentInput } from "../types/razorpay.types";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { QUERY_KEYS } from "../../customers/constants";

export const useCreatePaymentOrderMutation = () => useMutation({
  mutationFn: (input: CreatePaymentOrderInput) => paymentServices.createPaymentOrder(input),
  onError: (error: Error) => toast.error(error.message || "Unable to start payment."),
});

export const useVerifyPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerifyPaymentInput) => paymentServices.verifyPayment(input),
    onSuccess: async (result, input) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [COLLECTIONS.ORDERS, input.applicationOrderId] }),
        queryClient.invalidateQueries({ queryKey: [COLLECTIONS.ORDERS] }),
        queryClient.invalidateQueries({ queryKey: [COLLECTIONS.PAYMENTS] }),
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
      ]);
      if (result.success && result.status === "PAID") toast.success("Payment confirmed. Your order is placed.");
      else toast.info(result.message || "Payment is being confirmed.");
    },
    onError: (error: Error) => toast.error(error.message || "Unable to verify payment. Check your order status before retrying."),
  });
};

export const usePaymentsQuery = (filters: PaymentFilters) => {
  return useQuery({
    queryKey: ["payments", 'list', filters],
    queryFn: () => paymentServices.getPayments(filters),
    staleTime: 30 * 1000,
  });
};