
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Gift,
  LayoutDashboard,
  Megaphone,
  Package,
  PackageCheck,
  Palette,
  Percent,
  Plug,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Users,
  Wallet,
  Warehouse,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useProductsQuery } from "@/features/products/hooks/useProduct";

interface DashboardMetricProps {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  href: string;
  tone?: "default" | "warning" | "success";
}

function DashboardMetric({
  label,
  value,
  description,
  icon: Icon,
  href,
  tone = "default",
}: DashboardMetricProps) {
  const iconTone = {
    default: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-600",
    success: "bg-emerald-500/10 text-emerald-600",
  }[tone];

  return (
    <Link
      href={href}
      className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-lg p-2.5 ${iconTone}`}>
          <Icon className="h-5 w-5" />
        </div>

        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <p className="mt-5 text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}

interface ModuleItem {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

function ModuleSection({
  title,
  description,
  modules,
}: {
  title: string;
  description: string;
  modules: ModuleItem[];
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map(({ label, description: detail, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {label}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}

const commerceModules: ModuleItem[] = [
  {
    label: "Products",
    description: "Catalog, pricing and publication status",
    href: "/console/products",
    icon: Package,
  },
  {
    label: "Categories",
    description: "Organize the product catalog",
    href: "/console/categories",
    icon: Boxes,
  },
  {
    label: "Collections",
    description: "Curated storefront collections",
    href: "/console/collections",
    icon: ShoppingBag,
  },
  {
    label: "Inventory",
    description: "Stock levels and availability",
    href: "/console/inventory",
    icon: Warehouse,
  },
  {
    label: "Orders",
    description: "Review and fulfil customer orders",
    href: "/console/orders",
    icon: ClipboardList,
  },
  {
    label: "Payments",
    description: "Payment records and transaction status",
    href: "/console/payments",
    icon: Wallet,
  },
  {
    label: "Shipments",
    description: "Shipping and fulfilment tracking",
    href: "/console/shipments",
    icon: Truck,
  },
  {
    label: "Customers",
    description: "Customer records and purchase activity",
    href: "/console/customers",
    icon: Users,
  },
  {
    label: "Coupons",
    description: "Discount codes and promotions",
    href: "/console/coupons",
    icon: Percent,
  },
  {
    label: "Reviews",
    description: "Customer product feedback",
    href: "/console/reviews",
    icon: Star,
  },
];

const growthModules: ModuleItem[] = [
  {
    label: "Store Content",
    description: "Storefront content and SEO",
    href: "/console/content",
    icon: FileText,
  },
  {
    label: "Notifications",
    description: "Customer and order notifications",
    href: "/console/notifications",
    icon: Bell,
  },
  {
    label: "Integrations",
    description: "Payment and external service integrations",
    href: "/console/integrations",
    icon: Plug,
  },
];

const administrationModules: ModuleItem[] = [
  {
    label: "Admins & Roles",
    description: "Administrator accounts and permissions",
    href: "/console/admins",
    icon: ShieldCheck,
  },
  {
    label: "Audit Logs",
    description: "Review administrative activity",
    href: "/console/audit-logs",
    icon: Activity,
  },
  {
    label: "Settings",
    description: "Store and operational configuration",
    href: "/console/settings",
    icon: Settings,
  },
];

export default function AdminPage() {
  const {
    data: products,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useProductsQuery({ all: true });

  const productList = products ?? [];

  const totalProducts = productList.length;

  const publishedProducts = productList.filter(
    (product) => product.isPublished,
  ).length;

  const draftProducts = productList.filter(
    (product) => !product.isPublished,
  ).length;

  const outOfStockProducts = productList.filter(
    (product) => product.stockQuantity <= 0,
  ).length;

  const lowStockProducts = productList.filter(
    (product) =>
      product.stockQuantity > 0 && product.stockQuantity <= 5,
  ).length;

  const totalUnits = productList.reduce(
    (total, product) => total + Math.max(0, product.stockQuantity),
    0,
  );

  const metrics: DashboardMetricProps[] = [
    {
      label: "Total Products",
      value: String(totalProducts),
      description: "Products returned by the catalog query",
      icon: Package,
      href: "/console/products",
    },
    {
      label: "Published Products",
      value: String(publishedProducts),
      description: "Products currently marked as published",
      icon: CheckCircle2,
      href: "/console/products",
      tone: "success",
    },
    {
      label: "Low Stock",
      value: String(lowStockProducts),
      description: "Published or draft products with 1–5 units",
      icon: AlertTriangle,
      href: "/console/inventory",
      tone: lowStockProducts > 0 ? "warning" : "default",
    },
    {
      label: "Out of Stock",
      value: String(outOfStockProducts),
      description: "Products with no available units",
      icon: PackageCheck,
      href: "/console/inventory",
      tone: outOfStockProducts > 0 ? "warning" : "default",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LayoutDashboard className="h-4 w-4" />
              Admin Console
              <ChevronRight className="h-3.5 w-3.5" />
              Overview
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Monitor your MagicalStones store, manage daily operations,
              and access every administration feature from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh data
          </button>
        </header>

        {/* Data status */}
        {isError && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">
                Product metrics could not be loaded
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                The product summary may be unavailable. Other console
                modules can still be opened below.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg border bg-background px-4 py-2 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Overview metrics */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Store overview
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Current catalog and inventory indicators.
              </p>
            </div>

            <Link
              href="/console/products"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              View catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <DashboardMetric
                key={metric.label}
                {...metric}
                value={
                  isPending || isError ? "—" : metric.value
                }
              />
            ))}
          </div>
        </section>

        {/* Inventory attention */}
        <section className="grid gap-4 lg:grid-cols-3">
          <Link
            href="/console/inventory"
            className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 transition-colors hover:bg-amber-500/10"
          >
            <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Inventory attention</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {isPending || isError
                  ? "Inventory metrics are currently unavailable."
                  : `${lowStockProducts} low-stock and ${outOfStockProducts} out-of-stock products need review.`}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-700">
                Review inventory
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link
            href="/console/products"
            className="flex items-start gap-3 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/20"
          >
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <EyeOffIcon />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Unpublished products</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {isPending || isError
                  ? "Publication status is currently unavailable."
                  : `${draftProducts} products are not published.`}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Manage catalog
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link
            href="/console/inventory"
            className="flex items-start gap-3 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/20"
          >
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Warehouse className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Units in inventory</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {isPending || isError
                  ? "Inventory totals are currently unavailable."
                  : `${totalUnits.toLocaleString("en-IN")} units across the fetched catalog.`}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open inventory
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </section>

        {/* Main commerce features */}
        <ModuleSection
          title="Commerce operations"
          description="Manage products, fulfilment, customers and transactions."
          modules={commerceModules}
        />

        {/* Growth and configuration */}
        <ModuleSection
          title="Storefront & growth"
          description="Manage customer communication, storefront content and integrations."
          modules={growthModules}
        />

        {/* Administration */}
        <ModuleSection
          title="Administration & security"
          description="Control access, review administrative activity and configure the store."
          modules={administrationModules}
        />

        {/* Footer note */}
        <footer className="flex flex-col gap-2 border-t pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            MagicalStones · Store administration
          </span>
          <span>
            Product metrics reflect the data returned by the current catalog query.
          </span>
        </footer>
      </div>
    </main>
  );
}

function EyeOffIcon() {
  return <Activity className="h-5 w-5" />;
}
