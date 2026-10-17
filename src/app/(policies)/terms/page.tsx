import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/policy-layout";

export const metadata: Metadata = {
  title: "Terms and Conditions | MagicalStones",
  description: "Terms governing the use of the MagicalStones online store.",
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyLayout
      title="Terms and Conditions"
      description="Please read these terms carefully before using MagicalStones or placing an order."
      sections={[
        {
          title: "Acceptance of Terms",
          content: (
            <p>
              By accessing or using MagicalStones, you agree to these Terms and
              Conditions and applicable laws. If you do not agree, please
              discontinue using the website.
            </p>
          ),
        },
        {
          title: "About MagicalStones",
          content: (
            <p>
              MagicalStones is an online storefront offering products for purchase.
              The legal business name, registered address, and contact details
              must be published here before these terms are finalized.
            </p>
          ),
        },
        {
          title: "Products and Availability",
          content: (
            <p>
              Product descriptions, images, prices, and availability are
              provided for informational and purchasing purposes. We aim to
              maintain accurate listings but cannot guarantee that every listing
              is free from errors. Orders may require clarification or
              cancellation if a material listing error occurs, subject to
              applicable law.
            </p>
          ),
        },
        {
          title: "Pricing and Payments",
          content: (
            <p>
              Prices, applicable taxes, shipping charges, and the final payable
              amount will be shown during checkout where applicable. Payments
              are processed through the payment provider presented at checkout.
              An order confirmation does not override any applicable consumer
              rights.
            </p>
          ),
        },
        {
          title: "Orders and Fulfilment",
          content: (
            <p>
              Order acceptance, processing, dispatch, delivery, cancellation,
              and returns are governed by the information provided at checkout
              and our Shipping, Cancellation, and Return Policies. We will
              communicate material order updates using the contact details
              provided with an order.
            </p>
          ),
        },
        {
          title: "Customer Responsibilities",
          content: (
            <p>
              You must provide accurate order and delivery information and use
              the website lawfully. You must not attempt to disrupt the website,
              interfere with its operation, or use it for fraudulent activities.
            </p>
          ),
        },
        {
          title: "Intellectual Property",
          content: (
            <p>
              Website content, branding, graphics, text, and other materials are
              owned by MagicalStones or their respective rights holders unless
              otherwise stated. They may not be reproduced or used commercially
              without the necessary authorization.
            </p>
          ),
        },
        {
          title: "Limitation of Liability",
          content: (
            <p>
              Nothing in these terms excludes or limits liability where such
              exclusion or limitation is prohibited by applicable law. Subject
              to that restriction, any limitation of liability will apply only
              to the extent permitted by law.
            </p>
          ),
        },
        {
          title: "Changes to These Terms",
          content: (
            <p>
              We may update these terms when our services or legal obligations
              change. Updated terms will be published on this page with a
              revised update date. Applicable statutory rights remain
              unaffected.
            </p>
          ),
        },
        {
          title: "Governing Law and Contact",
          content: (
            <p>
              These terms are subject to applicable Indian law, including
              applicable consumer protection requirements. Any jurisdiction
              provision must be finalized based on the business's actual
              registered location and applicable law. For questions, contact
              MagicalStones using the official contact details on the website.
            </p>
          ),
        },
      ]}
    />
  );
}
