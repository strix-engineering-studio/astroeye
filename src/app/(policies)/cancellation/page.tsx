import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/policy-layout";

export const metadata: Metadata = {
  title: "Cancellation Policy | Astroeye",
  description:
    "Understand order cancellation and refund procedures at Astroeye.",
};

export default function CancellationPolicyPage() {
  return (
    <PolicyLayout
      title="Cancellation Policy"
      description="Understand when an Astroeye order can be cancelled and how eligible refunds are handled."
      sections={[
        {
          title: "Customer-Initiated Cancellation",
          content: (
            <p>
              Customers may request cancellation before an order reaches the
              applicable processing or dispatch stage. The available
              cancellation window and method should be displayed during checkout
              or in the order confirmation. A request is not automatically
              confirmed until its status is communicated.
            </p>
          ),
        },
        {
          title: "Orders Already Dispatched",
          content: (
            <p>
              Once an order has been handed to a delivery partner, cancellation
              may no longer be possible through the normal order process.
              Eligible cases will be handled under the Return Policy and
              applicable consumer law. This restriction does not remove
              statutory cancellation, return, or refund rights.
            </p>
          ),
        },
        {
          title: "How to Request Cancellation",
          content: (
            <p>
              Contact Astroeye using the official support details published on
              the website. Include your order number and the reason for
              cancellation. Do not send full payment card details or other
              sensitive payment credentials.
            </p>
          ),
        },
        {
          title: "Cancellation by Astroeye",
          content: (
            <p>
              We may need to cancel an order where a product is unavailable, a
              material pricing or listing error occurs, payment cannot be
              verified, or fulfilment is not possible. We will communicate the
              reason and arrange any applicable refund in accordance with law.
            </p>
          ),
        },
        {
          title: "Refunds for Cancelled Orders",
          content: (
            <p>
              Where payment has been collected for an order that is successfully
              cancelled, the eligible amount will be refunded through the
              original payment method where possible. The actual processing time
              depends on the payment provider and bank. Any deductions or
              exceptions must be lawful and disclosed before purchase.
            </p>
          ),
        },
        {
          title: "Cancellation Confirmation",
          content: (
            <p>
              Customers should retain the cancellation confirmation and order
              reference for future communication. If a refund has not arrived
              within the communicated timeframe, contact Astroeye with the
              relevant order reference.
            </p>
          ),
        },
      ]}
    />
  );
}
