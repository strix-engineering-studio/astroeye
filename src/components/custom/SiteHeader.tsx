
import Link from "next/link";

const categories = [
  { label: "All Products", href: "/products" },
  { label: "Rudraksha", href: "/products?category=rudraksha" },
  { label: "Gemstones", href: "/products?category=gemstones" },
  {
    label: "Spiritual Jewellery",
    href: "/products?category=spiritual-jewellery",
  },
  {
    label: "Puja Essentials",
    href: "/products?category=puja-essentials",
  },
  {
    label: "Idols & Murtis",
    href: "/products?category=idols-and-murtis",
  },
  { label: "Yantras", href: "/products?category=yantras" },
  {
    label: "Incense & Dhoop",
    href: "/products?category=incense-and-dhoop",
  },
  { label: "Books", href: "/products?category=books" },
];


export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E9E0D4] bg-[#FCFAF6]/95 backdrop-blur-xl">
      

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            aria-label="MagicalStones home"
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C49A62] font-serif text-2xl text-[#9D693A]">
              M
            </span>

            <span>
              <span className="block font-serif text-xl font-semibold tracking-wide text-[#29251F] sm:text-2xl">
                MagicalStones
              </span>
              <span className="hidden text-[9px] uppercase tracking-[0.2em] text-[#897B69] sm:block">
                Discover something meaningful
              </span>
            </span>
          </Link>

          {/* Search */}
          <form
            action="/search"
            method="get"
            role="search"
            className="hidden min-w-0 max-w-xl flex-1 md:block md:px-5"
          >
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>

            <div className="flex h-11 items-center rounded-full border border-[#E4D9C9] bg-white px-4 transition focus-within:border-[#B78B57]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5 shrink-0 text-[#897B69]"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>

              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Search gemstones, malas, puja essentials..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#29251F] outline-none placeholder:text-[#A69A8A]"
              />

              <button
                type="submit"
                className="shrink-0 text-sm font-semibold text-[#8A5D32] hover:text-[#29251F]"
              >
                Search
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/search"
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9E0D4] text-[#5E5142] transition hover:bg-[#F3EBDD] md:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>
            </Link>

            <Link
              href="/account"
              aria-label="My account"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#E9E0D4] text-[#5E5142] transition hover:bg-[#F3EBDD] sm:flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="flex h-10 items-center gap-2 rounded-full bg-[#29251F] px-4 text-sm font-medium text-white transition hover:bg-[#514538]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              <span>Bag</span>
            </Link>
          </div>
        </div>

        {/* Category navigation */}
        <nav
          aria-label="Product categories"
          className="flex gap-6 overflow-x-auto border-t border-[#E9E0D4] py-3 text-xs text-[#65594B] sm:gap-8 sm:text-sm"
        >
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="shrink-0 whitespace-nowrap transition hover:text-[#9D693A]"
            >
              {category.label}
            </Link>
          ))}

          
        </nav>
      </div>
    </header>
  );
}
