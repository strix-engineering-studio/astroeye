import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/components/layout/AdminLayout";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <TooltipProvider>
      <AdminLayout>{children}</AdminLayout>
    </TooltipProvider>
  );
}
