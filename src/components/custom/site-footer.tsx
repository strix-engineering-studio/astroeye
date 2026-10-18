
import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Shop All", href: "/shop" },
      { label: "All Categories", href: "/categories" },
      { label: "Rudraksha", href: "/categories/rudraksha" },
      { label: "Gemstones", href: "/categories/gemstones" },
      { label: "Spiritual Jewellery", href: "/categories/spiritual-jewellery" },
      { label: "Puja Essentials", href: "/categories/puja-essentials" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Cancellation Policy", href: "/cancellation" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

const paymentMethods = ["UPI", "Cards", "Net Banking"];

export default function Footer() {
  return (
    <footer className="border-t border-[#E8DFD2] bg-[#F6F1E9] text-[#29251F]">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-20">
          {/* Brand */}
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C49A62] font-serif text-2xl text-[#9D693A]">
                M
              </span>

              <span>
                <span className="block font-serif text-2xl font-semibold tracking-wide">
                  MagicalStones
                </span>
                <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-[#897B69]">
                  A spiritual marketplace
                </span>
              </span>
            </Link>

            <p className="mt-6 text-sm leading-7 text-[#776D60]">
              Discover spiritual jewellery, gemstones, puja essentials and
              meaningful products for your home, traditions and everyday
              rituals.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 border-b border-[#B78B57] pb-1 text-sm font-medium text-[#8A5D32] transition hover:gap-3"
            >
              Explore the marketplace <span aria-hidden="true">↗</span>
            </Link>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#65594B]">
                Need assistance?
              </p>

              <Link
                href="/contact"
                className="mt-2 inline-block text-sm text-[#8A5D32] underline-offset-4 hover:underline"
              >
                Get in touch with our team
              </Link>
            </div>
          </div>

          {/* Navigation groups */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-[#29251F]">
                  {group.title}
                </h2>

                <ul className="mt-5 space-y-3.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm leading-6 text-[#776D60] transition-colors hover:text-[#9D693A]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 grid gap-4 border-y border-[#E4D9C9] py-6 sm:grid-cols-3 sm:gap-6">
          <div className="flex items-start gap-3">
            <span className="text-xl text-[#9D693A]" aria-hidden="true">
              ◇
            </span>
            <div>
              <p className="text-sm font-medium">Secure Payments</p>
              <p className="mt-1 text-xs leading-5 text-[#897B6D]">
                Convenient online checkout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl text-[#9D693A]" aria-hidden="true">
              ↗
            </span>
            <div>
              <p className="text-sm font-medium">Order Assistance</p>
              <p className="mt-1 text-xs leading-5 text-[#897B6D]">
                Support for your shopping experience.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl text-[#9D693A]" aria-hidden="true">
              ♡
            </span>
            <div>
              <p className="text-sm font-medium">Customer Care</p>
              <p className="mt-1 text-xs leading-5 text-[#897B6D]">
                Help with product and order queries.
              </p>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[#65594B]">
              Payment options
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-[#E4D9C9] bg-[#FCFAF6] px-3 py-1.5 text-xs text-[#776D60]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#29251F] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#514538] sm:self-center"
          >
            Start Shopping <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E4D9C9] bg-[#EEE6DA]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-[#776D60] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} MagicalStones. All rights reserved.
          </p>

          <p className="leading-5">
            Thoughtfully curated. Conveniently discovered.
          </p>
        </div>
      </div>
    </footer>
  );
}
