
import type { Metadata } from "next";
import PolicyLayout from "@/components/layout/policy-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Astroeye",
  description: "Learn how Astroeye collects, uses, and protects personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="This policy explains how Astroeye handles personal information when you visit our website or place an order."
      sections={[
        {
          title: "Information We Collect",
          content: (
            <p>
              Depending on your interactions with Astroeye, we may collect
              your name, phone number, email address, shipping address, order
              details, payment status, customer support communications, and
              technical information such as browser and device data.
              Payment card or banking credentials should be handled by the
              payment provider and not stored directly by Astroeye unless
              specifically required and appropriately secured.
            </p>
          ),
        },
        {
          title: "How We Use Information",
          content: (
            <p>
              We use information to process orders, coordinate delivery,
              communicate order updates, respond to support requests, prevent
              fraud, maintain website security, meet legal obligations, and
              improve our services.
            </p>
          ),
        },
        {
          title: "Cookies and Similar Technologies",
          content: (
            <p>
              The website may use essential technologies to maintain cart
              contents, support checkout, remember preferences, and understand
              website performance. Any optional analytics or advertising
              technologies must be disclosed and enabled in accordance with
              applicable requirements.
            </p>
          ),
        },
        {
          title: "Sharing of Information",
          content: (
            <p>
              Information may be shared with payment processors, shipping
              aggregators, delivery partners, hosting providers, customer
              support providers, and other service providers when necessary
              to operate the store. Information may also be disclosed where
              required by law. We do not authorize service providers to use
              customer data for unrelated purposes.
            </p>
          ),
        },
        {
          title: "WhatsApp and Other Communications",
          content: (
            <p>
              If WhatsApp or another messaging channel is used for order
              confirmations, delivery updates, or promotional communications,
              the applicable contact details may be processed for those
              purposes. Promotional messages should be sent only in accordance
              with applicable consent and opt-out requirements.
            </p>
          ),
        },
        {
          title: "Data Retention",
          content: (
            <p>
              We retain personal information only for as long as reasonably
              necessary for the purposes described in this policy, including
              order fulfilment, dispute resolution, accounting, and legal
              compliance. Retention periods depend on the data type and
              applicable legal requirements.
            </p>
          ),
        },
        {
          title: "Security",
          content: (
            <p>
              We use appropriate technical and organizational safeguards to
              protect information. No online system can guarantee absolute
              security. Access controls, restricted database permissions,
              secure transmission, and appropriate handling of credentials
              should be maintained across our systems and service providers.
            </p>
          ),
        },
        {
          title: "Your Rights and Choices",
          content: (
            <p>
              Subject to applicable law, you may request access to, correction
              of, or deletion of personal information, or raise concerns about
              its processing. Certain records may need to be retained to meet
              legal obligations. Contact Astroeye through its official
              published contact details to submit a request.
            </p>
          ),
        },
        {
          title: "Children's Privacy",
          content: (
            <p>
              Astroeye is not intended to collect children's personal
              information unlawfully. Where applicable law requires parental
              consent or additional safeguards, those requirements must be
              followed.
            </p>
          ),
        },
        {
          title: "Policy Updates and Contact",
          content: (
            <p>
              We may update this policy as our services, technology, or legal
              obligations change. The revised version and its update date will
              appear on this page. Add the business's legal name and designated
              privacy contact before publication.
            </p>
          ),
        },
      ]}
    />
  );
}
;
