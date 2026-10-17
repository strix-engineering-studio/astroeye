import { AdminUsersPage } from "@/features/admins";

export const metadata = {
  title: "MagicalStones - Admins",
  description: "Admin dashboard for managing the application",
};

export default function UsersRoute() {
  return <AdminUsersPage />;
}
