import AuthLayout from "@/src/components/layout/AuthLayout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
