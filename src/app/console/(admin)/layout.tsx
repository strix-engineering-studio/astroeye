import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/src/components/layout/AdminLayout";
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <AdminLayout>{children}</AdminLayout>
    </TooltipProvider>
  );
}
