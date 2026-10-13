import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/policy-layout";

export const metadata: Metadata = {
  title: "Shipping Policy | Astroeye",
  description: "Learn about Astroeye order processing, shipping, and delivery.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      description="Information about order processing, shipping charges, delivery estimates, and shipment tracking."
      sections={[
        {
          title: "Order Processing",
          content: (
            <p>
              Orders are processed after successful order placement and payment
              confirmation, where applicable. Processing times may vary based on
              product availability, order volume, verification, and operational
              requirements. Display the actual processing estimate at checkout
              or in the order confirmation.
            </p>
          ),
        },
        {
          title: "Shipping Locations",
          content: (
            <p>
              Delivery availability depends on the destination PIN code and the
              service coverage of our shipping partners. An address may be
              unavailable for delivery if the destination is outside supported
              service areas.
            </p>
          ),
        },
        {
          title: "Shipping Charges",
          content: (
            <p>
              Shipping charges, applicable taxes, and any additional fees will
              be shown before the customer completes checkout. Any free-shipping
              conditions or location-based charges should be clearly disclosed
              at the point of purchase.
            </p>
          ),
        },
        {
          title: "Estimated Delivery",
          content: (
            <p>
              Estimated delivery dates are indicative and may be affected by
              courier capacity, weather, public holidays, regional disruptions,
              or other circumstances outside our reasonable control. Astroeye
              should publish realistic delivery estimates based on its shipping
              aggregator and fulfilment arrangements.
            </p>
          ),
        },
        {
          title: "Order Tracking",
          content: (
            <p>
              Where tracking is supported, shipment information or a tracking
              link may be shared through the contact channel provided with the
              order. Tracking updates are supplied by the relevant shipping
              partner and may not appear immediately after dispatch.
            </p>
          ),
        },
        {
          title: "Incorrect or Incomplete Addresses",
          content: (
            <p>
              Customers are responsible for providing accurate delivery details.
              An incorrect or incomplete address may delay delivery or result in
              a failed delivery attempt. Contact Astroeye promptly if you
              identify an address error; changes may not be possible once a
              shipment has been dispatched.
            </p>
          ),
        },
        {
          title: "Failed Delivery or Damaged Packages",
          content: (
            <p>
              If a delivery attempt fails or a package arrives visibly damaged,
              contact Astroeye using the official support details. Provide the
              order reference and relevant photographs where appropriate.
              Resolution will depend on the circumstances, shipping records,
              product condition, and applicable law.
            </p>
          ),
        },
        {
          title: "Delivery Delays and Support",
          content: (
            <p>
              If a shipment exceeds its communicated delivery estimate, contact
              Astroeye with your order number. We will review the available
              tracking information and coordinate with the delivery partner
              where necessary. Applicable consumer rights and remedies remain
              unaffected.
            </p>
          ),
        },
      ]}
    />
  );
}
