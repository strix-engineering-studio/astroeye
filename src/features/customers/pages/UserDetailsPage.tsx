"use client";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Edit,
  Trash2,
  UserCheck,
  ShieldAlert,
  Mail,
  Phone,
  Calendar,
  Crown,
  Shield,
  User,
  Users,
  FileText,
  BookOpen,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserType } from "../types";

interface UserDetailsPageProps {
  user: UserType;

  onEdit: () => void;

  onDelete: () => void;

  onSuspend: () => void;

  onActivate: () => void;
}

export function UserDetailsPage({
  user,
  onEdit,
  onDelete,
  onSuspend,
  onActivate,
}: UserDetailsPageProps) {
  const router = useRouter();

  const isActive = user.isActive;

  const initials = user.fullName
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString();
  };

  const formatDateTime = (date?: Date | string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString();
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<User className="h-4 w-4" />}
              label="Full Name"
              value={user.fullName}
            />

            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              label="Email Address"
              value={user.email}
            />

            <InfoItem
              icon={<Phone className="h-4 w-4" />}
              label="Phone Number"
              value={user.phoneNumber}
            />

            <InfoItem
              icon={<User className="h-4 w-4" />}
              label="Gender"
              value={user.gender || "-"}
            />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<Crown className="h-4 w-4" />}
              label="Membership Type"
              value={user.membershipType}
            />

            <InfoItem
              icon={<UserCheck className="h-4 w-4" />}
              label="Expert"
              value={user.isExpert ? "Yes" : "No"}
            />

            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Joined On"
              value={formatDate(user.createdAt)}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Activity</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Account Created"
            value={formatDateTime(user.createdAt)}
          />

          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Last Updated"
            value={formatDateTime(user.updatedAt)}
          />
        </CardContent>
      </Card>

      {/* ========================================
            CHILDREN
        ======================================== */}

      <div>
        {user.children?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {user.children.map((child) => (
              <Card key={child.name}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{child.name}</p>
                    </div>

                    {child.gender ? (
                      <Badge variant="secondary">{child.gender}</Badge>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No children added"
            description="This user has not added any child profiles yet."
          />
        )}
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
        {icon}
        <span>{label}</span>
      </div>

      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          {icon}
        </div>

        <h3 className="font-semibold">{title}</h3>

        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
