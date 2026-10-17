import Link from "next/link";

const shopLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Rudraksha", href: "/categories/rudraksha" },
  { label: "Gemstones", href: "/categories/gemstones" },
  { label: "Puja Essentials", href: "/categories/puja-essentials" },
  { label: "Idols & Murtis", href: "/categories/idols-and-murtis" },
  { label: "Yantras", href: "/categories/yantras" },
  { label: "Malas & Japa", href: "/categories/malas-and-japa" },
];

const serviceLinks = [
  { label: "Astrology Consultations", href: "/consultations" },
  { label: "Puja & Anushthan", href: "/puja-services" },
  { label: "Astrologer Marketplace", href: "/astrologers" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Frequently Asked Questions", href: "/faq" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Cancellation Policy", href: "/cancellation" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm text-[#BEB1A0] transition-colors duration-200 hover:text-[#E4C79D]"
      >
        {children}
      </Link>
    </li>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E4C79D]">
        {title}
      </h3>

      <ul className="mt-6 space-y-4">
        {links.map((link) => (
          <FooterLink key={link.href} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-[#29251F] text-[#E9DFD1]">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_2fr] lg:gap-16">
          {/* Brand and introduction */}
          <div className="max-w-md">
            <Link
              href="/"
              aria-label="MagicalStones home"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C49A62] font-serif text-3xl text-[#D9B783] transition-colors group-hover:bg-[#C49A62]/10">
                A
              </span>

              <span>
                <span className="block font-serif text-3xl tracking-wide text-white">
                  MagicalStones
                </span>
                <span className="mt-0.5 block text-[9px] uppercase tracking-[0.28em] text-[#B8A68F]">
                  Your spiritual destination
                </span>
              </span>
            </Link>

            <p className="mt-7 text-sm leading-7 text-[#BEB1A0]">
              A thoughtful destination for spiritual essentials, astrology
              tools, sacred products and traditional services. Discover
              meaningful additions to your everyday rituals.
            </p>

            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 border-b border-[#C49A62]/60 pb-1 text-sm text-[#E4C79D] transition-colors hover:border-[#E4C79D] hover:text-white"
            >
              Discover our story
              <span aria-hidden="true">↗</span>
            </Link>

            {/* Customer contact */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[#9E9180]">
                Need assistance?
              </p>

              <Link
                href="/contact"
                className="mt-2 inline-block font-serif text-xl text-white transition-colors hover:text-[#E4C79D]"
              >
                We&apos;re here to help.
              </Link>

              <p className="mt-2 text-sm text-[#BEB1A0]">
                Product enquiries, orders and service assistance.
              </p>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            <FooterColumn title="Shop" links={shopLinks} />

            <FooterColumn title="Services" links={serviceLinks} />

            <FooterColumn title="Customer Care" links={supportLinks} />

            <FooterColumn title="Information" links={legalLinks} />
          </div>
        </div>

        {/* Brand statement */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 sm:pt-10">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#C49A62]">
                A more thoughtful way to discover
              </p>

              <p className="mt-3 max-w-2xl font-serif text-2xl leading-snug text-[#F5EBDD] sm:text-3xl">
                Find meaning in the little things.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex w-fit items-center gap-3 rounded-full border border-[#C49A62]/60 px-5 py-3 text-sm text-[#E4C79D] transition-colors hover:bg-[#E4C79D] hover:text-[#29251F]"
            >
              Explore the store
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#211E19]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 text-xs text-[#9E9384] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} MagicalStones. All rights reserved.</p>

          <p className="text-[#BEB1A0]">
            Made for a more thoughtful spiritual shopping experience.
          </p>

          <nav
            aria-label="Legal links"
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            {legalLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#E4C79D]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
