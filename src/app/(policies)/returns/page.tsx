import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/policy-layout";

export const metadata: Metadata = {
  title: "Return Policy | Astroeye",
  description: "Review Astroeye's return eligibility and refund process.",
};

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Return and Refund Policy"
      description="Learn how to request a return, report damaged products, and receive eligible refunds."
      sections={[
        {
          title: "Return Eligibility",
          content: (
            <p>
              Products may be eligible for return if they are damaged,
              defective, incorrect, or otherwise qualify under the return
              conditions communicated at purchase and applicable law. Any
              product-specific eligibility restrictions must be disclosed
              clearly before the order is placed.
            </p>
          ),
        },
        {
          title: "Return Window",
          content: (
            <p>
              The applicable return window must be specified for each eligible
              product or category. Customers should initiate a return within
              that period using the published support channel. This policy does
              not override any mandatory rights or remedies under applicable
              consumer law.
            </p>
          ),
        },
        {
          title: "Damaged, Defective, or Incorrect Products",
          content: (
            <p>
              If an item arrives damaged, defective, or different from the item
              ordered, contact Astroeye promptly with the order number, a
              description of the issue, and photographs where appropriate. We
              will assess the issue and communicate the available remedy, which
              may include replacement, repair, return, or refund as applicable.
            </p>
          ),
        },
        {
          title: "How to Request a Return",
          content: (
            <p>
              Contact Astroeye through its official support details and provide
              your order number, the affected product, and the reason for the
              request. Wait for return instructions before shipping the product
              back. Any authorization requirement must not be used to defeat
              applicable statutory rights.
            </p>
          ),
        },
        {
          title: "Product Condition and Packaging",
          content: (
            <p>
              Where relevant and lawful, products should be returned with their
              accessories, documentation, and original packaging. Customers
              should follow the return instructions provided. Missing packaging
              or ordinary handling must be assessed fairly under the applicable
              product terms and consumer law.
            </p>
          ),
        },
        {
          title: "Return Shipping Costs",
          content: (
            <p>
              Return shipping responsibility depends on the reason for the
              return and the terms disclosed at purchase. Astroeye should
              clearly specify who bears the cost for damaged, defective,
              incorrect, and eligible change-of-mind returns, subject to
              applicable law.
            </p>
          ),
        },
        {
          title: "Refund Processing",
          content: (
            <p>
              Once an eligible return or refund request is approved, the
              applicable amount will be processed through the original payment
              method where possible. The time for funds to appear depends on the
              payment provider and bank. The refund amount and any permitted
              deductions will be communicated to the customer.
            </p>
          ),
        },
        {
          title: "Non-Returnable Products",
          content: (
            <p>
              Any exclusions for particular products must be identified clearly
              on the relevant product page or before checkout. Exclusions may
              only be applied where lawful and must not eliminate mandatory
              remedies for defective, misrepresented, or incorrectly supplied
              products.
            </p>
          ),
        },
        {
          title: "Return Disputes and Support",
          content: (
            <p>
              If you disagree with a return decision or have not received an
              expected refund, contact Astroeye with your order reference and
              relevant correspondence. We will review the request and respond
              using the published customer support channel.
            </p>
          ),
        },
      ]}
    />
  );
}
