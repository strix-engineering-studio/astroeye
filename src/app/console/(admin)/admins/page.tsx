import { AdminUsersPage } from "@/features/admins";

export const metadata = {
  title: "Astroeye - Admins",
  description: "Admin dashboard for managing the application",
};

export default function UsersRoute() {
  return <AdminUsersPage />;
}
