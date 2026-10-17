import Link from "next/link";

const categories = [
  {
    name: "Rudraksha",
    detail: "Sacred beads & malas",
    icon: "◉",
    color: "bg-[#F4E7D5]",
  },
  {
    name: "Gemstones",
    detail: "Natural & spiritual stones",
    icon: "✧",
    color: "bg-[#E4E9F4]",
  },
  {
    name: "Puja Essentials",
    detail: "Everything for your rituals",
    icon: "🪔",
    color: "bg-[#F5E6D8]",
  },
  {
    name: "Idols & Murtis",
    detail: "Bring divinity home",
    icon: "ॐ",
    color: "bg-[#E8E5D7]",
  },
  {
    name: "Yantras",
    detail: "Sacred geometry",
    icon: "✺",
    color: "bg-[#F0E1E2]",
  },
  {
    name: "Astrology",
    detail: "Tools for astrologers",
    icon: "☼",
    color: "bg-[#E3E8DD]",
  },
  {
    name: "Malas & Japa",
    detail: "Prayer beads & counters",
    icon: "📿",
    color: "bg-[#F1E6D8]",
  },
  {
    name: "Incense & Dhoop",
    detail: "Fragrance for devotion",
    icon: "♨",
    color: "bg-[#E5E5F0]",
  },
];

const products = [
  {
    name: "Natural Rudraksha Mala",
    category: "Rudraksha",
    price: 799,
    oldPrice: 1199,
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Brass Diya Set",
    category: "Puja Essentials",
    price: 599,
    oldPrice: 899,
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Meditation Prayer Mala",
    category: "Malas & Japa",
    price: 449,
    oldPrice: 699,
    tag: "Customer favourite",
    image:
      "https://images.unsplash.com/photo-1604608672516-8c2b5f4d9d5e?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Sacred Spiritual Decor",
    category: "Spiritual Living",
    price: 999,
    oldPrice: 1499,
    tag: "Featured",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85",
  },
];

const services = [
  {
    number: "01",
    title: "Astrology Consultation",
    description:
      "Explore personalised astrology consultations, birth-chart readings and guidance from experienced practitioners.",
    icon: "✧",
    href: "/consultations",
  },
  {
    number: "02",
    title: "Puja & Anushthan",
    description:
      "Discover puja services, traditional rituals and spiritual ceremonies for your occasions and intentions.",
    icon: "ॐ",
    href: "/puja-services",
  },
  {
    number: "03",
    title: "Astrologer Marketplace",
    description:
      "Find spiritual products, consultation resources and essentials for your astrology practice.",
    icon: "☼",
    href: "/astrologers",
  },
];

const benefits = [
  {
    icon: "✧",
    title: "Thoughtfully Curated",
    description:
      "A considered selection of spiritual and astrology essentials.",
  },
  {
    icon: "◇",
    title: "Secure Payments",
    description: "A checkout experience designed to keep payments secure.",
  },
  {
    icon: "↗",
    title: "Reliable Delivery",
    description: "Order tracking and delivery updates for your purchases.",
  },
  {
    icon: "♡",
    title: "Customer Support",
    description: "Help with product selection, orders and service enquiries.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:mb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9D693A]">
        {eyebrow}
      </p>
      <h2 className="max-w-2xl font-serif text-3xl leading-tight text-[#29251F] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm leading-7 text-[#777066] sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FCFAF6] text-[#29251F]">
      {/* Announcement bar */}
      <div className="bg-[#29251F] px-4 py-2.5 text-center text-xs tracking-wide text-[#F7E9D3] sm:text-sm">
        Discover your spiritual essentials with MagicalStones.
        <span className="mx-2 text-[#C99A60]">✦</span>
        Shop with confidence.
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#EAE3D9] bg-[#FCFAF6]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C49A62] font-serif text-2xl text-[#9D693A]">
              A
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-wide">
                MagicalStones
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-[#897B69]">
                Your spiritual destination
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-[#62594D] lg:flex">
            <Link href="/shop" className="transition hover:text-[#A16C3C]">
              Shop All
            </Link>
            <Link
              href="/categories"
              className="transition hover:text-[#A16C3C]"
            >
              Categories
            </Link>
            <Link
              href="/consultations"
              className="transition hover:text-[#A16C3C]"
            >
              Consultations
            </Link>
            <Link
              href="/puja-services"
              className="transition hover:text-[#A16C3C]"
            >
              Puja Services
            </Link>
            <Link href="/about" className="transition hover:text-[#A16C3C]">
              About Us
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/search"
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE3D9] text-lg transition hover:bg-[#F1E8DC]"
            >
              ⌕
            </Link>
            <Link
              href="/account"
              aria-label="My account"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#EAE3D9] text-lg transition hover:bg-[#F1E8DC] sm:flex"
            >
              ♙
            </Link>
            <Link
              href="/cart"
              className="flex h-10 items-center gap-2 rounded-full bg-[#29251F] px-4 text-sm text-white transition hover:bg-[#514538]"
            >
              <span>Bag</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto border-t border-[#EAE3D9] px-4 py-3 text-xs text-[#6F6558] lg:hidden">
          {[
            "Shop All",
            "Rudraksha",
            "Gemstones",
            "Puja Essentials",
            "Idols",
            "Astrology",
          ].map((item) => (
            <Link
              key={item}
              href="/categories"
              className="shrink-0 whitespace-nowrap transition hover:text-[#A16C3C]"
            >
              {item}
            </Link>
          ))}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F2E8D8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#C5A67C]/30 sm:h-[480px] sm:w-[480px]" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full border border-[#C5A67C]/30 sm:h-[400px] sm:w-[400px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C8AC85] bg-white/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#77572F]">
              <span className="text-base">✧</span>A world of spiritual
              discoveries
            </p>

            <h1 className="max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight text-[#29251F] sm:text-6xl lg:text-7xl">
              Find meaning in
              <br />
              <span className="font-normal italic text-[#A16C3C]">
                every moment.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#716657] sm:text-lg">
              Explore astrology essentials, sacred products, puja samagri and
              spiritual services — thoughtfully brought together in one
              destination.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 rounded-full bg-[#29251F] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#514538]"
              >
                Explore the Store <span>↗</span>
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-3 rounded-full border border-[#C8B69B] px-7 py-4 text-sm font-medium text-[#44372A] transition hover:bg-white/60"
              >
                Browse Categories
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#D9C9B1] pt-6 text-xs text-[#776957] sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="text-[#A16C3C]">✧</span> Spiritual essentials
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#A16C3C]">◇</span> Convenient shopping
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#A16C3C]">♡</span> Customer care
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[48%_48%_12px_12px] border border-[#C5A67C]/50" />
            <div className="relative h-[370px] overflow-hidden rounded-[48%_48%_12px_12px] bg-[#D9C6A9] sm:h-[490px]">
              <img
                src="https://images.unsplash.com/photo-1604608672516-8c2b5f4d9d5e?auto=format&fit=crop&w=1100&q=90"
                alt="Spiritual meditation and sacred objects"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#29251F]/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">
                <p className="text-xs uppercase tracking-[0.24em] text-[#EBD2AA]">
                  Discover your path
                </p>
                <p className="mt-3 max-w-sm font-serif text-3xl leading-tight sm:text-4xl">
                  A little more meaning in everyday life.
                </p>
                <Link
                  href="/shop"
                  className="mt-5 inline-flex items-center gap-2 border-b border-white/70 pb-1 text-sm"
                >
                  Discover MagicalStones <span>↗</span>
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 flex h-20 w-20 items-center justify-center rounded-full border border-[#D1B58D] bg-[#FCFAF6] font-serif text-3xl text-[#A16C3C] sm:-left-8 sm:h-24 sm:w-24">
              ॐ
            </div>
          </div>
        </div>
      </section>

      {/* Store benefits */}
      <section className="border-b border-[#EAE3D9] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-7 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3E9DA] text-xl text-[#956537]">
                {benefit.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold">{benefit.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#83786A]">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading
            eyebrow="Explore MagicalStones"
            title="A place for all things spiritual."
            description="From everyday puja essentials to astrology tools, discover products for your personal practice and spiritual journey."
          />
          <Link
            href="/categories"
            className="mb-9 shrink-0 text-sm font-medium text-[#956537] hover:underline"
          >
            View all categories ↗
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}
              className="group rounded-2xl border border-[#EBE4DA] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-[#C8AD87] hover:shadow-lg hover:shadow-[#453622]/5 sm:p-6"
            >
              <div
                className={`flex aspect-[1.4/1] items-center justify-center rounded-xl ${category.color} transition group-hover:scale-[1.01]`}
              >
                <span className="font-serif text-5xl text-[#74583A] transition duration-300 group-hover:scale-110">
                  {category.icon}
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold sm:text-base">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#83786A]">
                    {category.detail}
                  </p>
                </div>
                <span className="mt-1 text-[#A16C3C] transition group-hover:translate-x-1">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#2D2924]">
          <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border border-[#B99868]/25" />
          <div className="absolute -right-6 -top-14 h-64 w-64 rounded-full border border-[#B99868]/25" />
          <div className="relative grid items-center gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1fr_auto] lg:px-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D2AC77]">
                Your ritual, your way
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-[#FCF5E9] sm:text-5xl">
                Make space for what matters.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#D2C6B5] sm:text-base">
                Discover everyday essentials for prayer, meditation and
                traditional rituals. Build a practice that feels personal to
                you.
              </p>
              <Link
                href="/shop"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#E4C79D] px-6 py-3.5 text-sm font-semibold text-[#29251F] transition hover:bg-[#F0DDBD]"
              >
                Shop Spiritual Essentials <span>↗</span>
              </Link>
            </div>
            <div className="hidden h-48 w-48 items-center justify-center rounded-full border border-[#C7A46D]/50 font-serif text-8xl text-[#D2AC77] lg:flex">
              ॐ
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="The MagicalStones edit"
            title="Discover your next favourite."
            description="Explore selected spiritual essentials for your home, rituals and everyday practice."
          />
          <Link
            href="/shop"
            className="mb-9 text-sm font-medium text-[#956537] hover:underline"
          >
            Shop all products ↗
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="group min-w-0">
              <Link
                href={`/shop/${product.name.toLowerCase().replaceAll(" ", "-")}`}
                className="relative block overflow-hidden rounded-2xl bg-[#F0E9DF]"
              >
                <div className="aspect-[4/4.6] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="absolute left-3 top-3 rounded-full bg-[#FCFAF6] px-3 py-1.5 text-[10px] font-semibold text-[#74583A] sm:text-xs">
                  {product.tag}
                </span>
                <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FCFAF6] text-lg transition group-hover:bg-[#29251F] group-hover:text-white">
                  ↗
                </span>
              </Link>
              <div className="mt-4">
                <p className="text-xs text-[#9B8B77]">{product.category}</p>
                <Link
                  href={`/shop/${product.name.toLowerCase().replaceAll(" ", "-")}`}
                  className="mt-1 block text-sm font-medium leading-6 transition hover:text-[#956537] sm:text-base"
                >
                  {product.name}
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[#9B9185] line-through">
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 rounded-full border border-[#CFC1AF] px-8 py-3.5 text-sm font-medium transition hover:border-[#29251F] hover:bg-[#29251F] hover:text-white"
          >
            Explore the Collection <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-[#EAE3D9] bg-[#F5EFE6]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow="Beyond the store"
            title="Explore spiritual services."
            description="MagicalStones brings products, traditional services and astrology-related experiences together in one place."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="flex flex-col rounded-2xl border border-[#E4D8C7] bg-[#FCFAF6] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0E4D2] font-serif text-2xl text-[#956537]">
                    {service.icon}
                  </span>
                  <span className="font-serif text-sm text-[#B8A68F]">
                    {service.number}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[#7B7165]">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="mt-6 inline-flex items-center gap-2 self-start border-b border-[#C8AD87] pb-1 text-sm font-medium text-[#956537] transition hover:gap-3"
                >
                  Explore service <span>↗</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="relative">
          <div className="aspect-[5/4] overflow-hidden rounded-3xl bg-[#E7D9C4]">
            <img
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1100&q=85"
              alt="Warm, natural spiritual setting"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 rounded-2xl border border-[#EAE3D9] bg-white px-5 py-4 shadow-sm sm:-right-5">
            <p className="font-serif text-xl text-[#956537]">MagicalStones</p>
            <p className="mt-1 text-xs text-[#83786A]">
              A destination for discovery
            </p>
          </div>
        </div>

        <div className="pt-3 lg:pt-0">
          <SectionHeading
            eyebrow="Our philosophy"
            title="Your spiritual journey deserves a thoughtful space."
            description="MagicalStones is envisioned as a destination where spiritual products, astrology essentials and traditional services come together. Our goal is to make discovering the right essentials simpler and more accessible."
          />

          <div className="space-y-4">
            {[
              "A curated destination for spiritual essentials.",
              "Products and services for different traditions and practices.",
              "A convenient experience from discovery to checkout.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEE2D0] text-sm text-[#956537]">
                  ✓
                </span>
                <p className="text-sm leading-6 text-[#6F6558]">{item}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#29251F] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#514538]"
          >
            Discover Our Story <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-[#EAE3D9] bg-[#F2E8D8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#956537]">
                The MagicalStones journal
              </p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                A little inspiration, delivered.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#786D5F]">
                Discover product updates, spiritual essentials and useful
                stories from the world of astrology and traditional practices.
              </p>
            </div>

            <form
              action="/newsletter"
              method="post"
              className="flex w-full max-w-lg gap-2"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                className="min-w-0 flex-1 rounded-full border border-[#D9C9B1] bg-[#FCFAF6] px-5 py-3.5 text-sm outline-none transition placeholder:text-[#9B8B77] focus:border-[#956537]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#29251F] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#514538] sm:px-7"
              >
                Subscribe ↗
              </button>
            </form>
          </div>
          <p className="mt-4 text-xs text-[#83786A]">
            By subscribing, you agree to receive email updates from MagicalStones.
            You can unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#29251F] text-[#E9DFD1]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8 lg:py-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C49A62] font-serif text-2xl text-[#D9B783]">
                A
              </span>
              <span className="font-serif text-3xl text-white">MagicalStones</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#BEB1A0]">
              Your destination for spiritual products, astrology essentials and
              traditional services.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-block text-sm text-[#D9B783] hover:underline"
            >
              Get in touch ↗
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm text-[#BEB1A0]">
              <li>
                <Link href="/shop" className="hover:text-white">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/consultations" className="hover:text-white">
                  Consultations
                </Link>
              </li>
              <li>
                <Link href="/puja-services" className="hover:text-white">
                  Puja Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Customer Care</h3>
            <ul className="mt-5 space-y-3 text-sm text-[#BEB1A0]">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-white">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-5 space-y-3 text-sm text-[#BEB1A0]">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About MagicalStones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-[#BEB1A0] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>© {new Date().getFullYear()} MagicalStones. All rights reserved.</p>
            <p>Made for a more thoughtful spiritual shopping experience.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
