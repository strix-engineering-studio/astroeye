"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/useAuth";
import { useOrdersQuery } from "@/features/orders/hooks/useOrders";
import { usersService } from "@/features/customers/services/usersService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/utils/date";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function CustomerAccountPage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading, refetch: refetchUser } = useCurrentUser();
  const { data: orders = [], isLoading: isOrdersLoading } = useOrdersQuery({
    userId: user?.uid || (user as { id?: string })?.id,
  });
  const logoutMutation = useLogout();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFullName((user as { fullName?: string; displayName?: string }).fullName || user.displayName || "");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid && !(user as { id?: string })?.id) return;
    const customerId = user.uid || (user as { id?: string })?.id;

    setIsUpdating(true);
    try {
      await usersService.updateUser(customerId as string, {
        fullName: fullName.trim(),
      });
      await refetchUser();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="max-w-md w-full text-center border-border/60 shadow-lg">
            <CardHeader className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl">Sign In Required</CardTitle>
              <CardDescription>
                You must be signed in as a customer to view your account details and order history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <Link href="/login" className="w-full inline-block">
                <Button className="w-full gap-2">
                  Sign In to Account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products" className="w-full inline-block">
                <Button variant="outline" className="w-full">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const userDisplayName =
    (user as { fullName?: string }).fullName || user.displayName || "Customer";
  const userEmail = user.email || "No email provided";
  const userPhone = user.phoneNumber || "No phone provided";
  const membership = (user as { membershipType?: string }).membershipType || "FREE";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                My Account
              </h1>
              <Badge variant="outline" className="text-xs uppercase border-primary/40 text-primary bg-primary/5">
                {membership}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your personal information and view your purchase history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/products">
              <Button variant="outline" size="sm" className="gap-2">
                <Package className="h-4 w-4" /> Storefront
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Profile Details & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Customer Profile</CardTitle>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsEditing(true)}
                    title="Edit name"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription>Verified customer identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button type="submit" size="sm" disabled={isUpdating}>
                      {isUpdating ? <Spinner className="h-4 w-4" /> : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="text-sm font-semibold">{userDisplayName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      <p className="text-sm font-medium">{userPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Authentication</p>
                      <p className="text-sm font-medium">Session Verified</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders / Purchase History */}
          <Card className="md:col-span-2 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Recent Orders & Purchases</CardTitle>
                <CardDescription>
                  Your complete verified purchase history
                </CardDescription>
              </div>
              <Link href="/products">
                <Button size="sm" variant="outline" className="gap-1">
                  Shop More <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="py-12 flex justify-center">
                  <Spinner className="h-6 w-6 text-muted-foreground" />
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">No orders found</p>
                    <p className="text-xs text-muted-foreground">
                      You haven&apos;t placed any orders yet. Discover our premium telescopes and optics.
                    </p>
                  </div>
                  <Link href="/products" className="inline-block pt-2">
                    <Button size="sm">Explore Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 divide-y">
                  {orders.map((order) => {
                    const statusColor =
                      order.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : order.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20";

                    return (
                      <div
                        key={order.id}
                        className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {order.title || `Order #${order.id.slice(-8)}`}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] uppercase font-semibold ${statusColor}`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Order ID: <span className="font-mono">{order.id}</span>
                            {order.paymentId && (
                              <>
                                {" "}• Payment ID:{" "}
                                <span className="font-mono">{order.paymentId}</span>
                              </>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt ?? Date.now())}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <span className="font-bold text-sm">
                            ₹{order.amount?.toLocaleString("en-IN") || "0"}
                          </span>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                              Details <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
