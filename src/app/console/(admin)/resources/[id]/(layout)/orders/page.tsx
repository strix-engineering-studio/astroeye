"use client";
import { OrdersPage } from "@/features/orders";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return (
    <OrdersPage
      filters={{
        resourceId: id,
      }}
    />
  );
}
