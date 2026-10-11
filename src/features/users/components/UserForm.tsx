"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User, UserRound, Shield, Image as ImageIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Gender, MembershipType, UserStatus } from "../types/users.enums";

import { COUNTRY_CODES } from "../constants/countryCodes";

import { UserFormInput, userFormSchema, UserFormValues } from "../schemas";

import { FormWrapper } from "@/components/wrappers/FormWrapper";
import { ImageUploader } from "@/components/upload/ImageUploader";

interface UserFormProps {
  mode: "create" | "edit";

  defaultValues?: Partial<UserFormValues>;

  onSubmit: (values: UserFormValues, image?: File) => void | Promise<void>;

  onCancel?: () => void;

  isSubmitting?: boolean;
}

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: UserFormProps) {
  const form = useForm<UserFormInput, unknown, UserFormValues>({
    resolver: zodResolver(userFormSchema),

    mode: "onChange",

    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      membershipType: MembershipType.FREE,
      gender: Gender.MALE,
      isActive: true,
      isExpert: false,
      countryCode: "91",
      profileImageUrl: undefined,

      ...defaultValues,

      status:
        (defaultValues?.isActive ?? true)
          ? UserStatus.ACTIVE
          : UserStatus.SUSPENDED,
    },
  });

  const isActive = form.watch("isActive");
  const isExpert = form.watch("isExpert");

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  /**
   * Reset form when edit data arrives.
   */
  useEffect(() => {
    if (!defaultValues) {
      return;
    }

    const active = defaultValues.isActive ?? true;

    form.reset({
      fullName: "",
      email: "",
      phoneNumber: "",
      membershipType: MembershipType.FREE,
      gender: Gender.MALE,
      isActive: active,
      isExpert: false,
      countryCode: "91",
      profileImageUrl: undefined,

      ...defaultValues,

      status: active ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    });

    setSelectedImageFile(null);
  }, [defaultValues, form]);

  /**
   * Keep status synchronized with account access.
   */
  useEffect(() => {
    const expectedStatus = isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED;

    if (form.getValues("status") !== expectedStatus) {
      form.setValue("status", expectedStatus, {
        shouldValidate: true,
      });
    }
  }, [isActive, form]);

  /**
   * Final submit handler.
   */
  const handleFormSubmit = async (values: UserFormValues) => {
    const submitValues: UserFormValues = {
      ...values,

      status: values.isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    };

    await onSubmit(submitValues, selectedImageFile ?? undefined);
  };

  const isCreateMode = mode === "create";

  return (
    <FormProvider {...form}>
      <FormWrapper
        form={form}
        showHeader={false}
        showDevelopmentDebug={true}
        submitting={isSubmitting}
        submitLabel={isCreateMode ? "Create User" : "Save Changes"}
        title={isCreateMode ? "Create User" : "Edit User"}
        description={
          isCreateMode
            ? "Create a new user account."
            : "Update user information and account settings."
        }
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
      >
        {/* <div className="w-full space-y-6"> */}
        {/* ============================================================
              PROFILE IMAGE
          ============================================================ */}

        {/* <Card className="overflow-hidden"> */}

        {/* <CardContent className="p-6"> */}
        <ImageUploader
          value={form.watch("profileImageUrl")}
          folder="users"
          title="Upload Image"
          description="Add a clear image for this user."
          onFileChange={(file) => {
            setSelectedImageFile(file ?? null);
          }}
        />
        {/* </CardContent> */}

        {/* </Card> */}

        {/* ============================================================
              BASIC INFORMATION
          ============================================================ */}

        <Card className="overflow-hidden">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>

            <CardDescription>
              Enter the user's primary account information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Full Name + Email */}

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="Full Name"
                required
                htmlFor="fullName"
                error={form.formState.errors.fullName?.message}
              >
                <Input
                  id="fullName"
                  {...form.register("fullName")}
                  maxLength={50}
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField
                label="Email"
                required
                htmlFor="email"
                error={form.formState.errors.email?.message}
              >
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter email address"
                />
              </FormField>
            </div>

            {/* Country Code + Mobile Number */}

            <div className="grid gap-6 md:grid-cols-[minmax(180px,0.7fr)_minmax(0,1.3fr)]">
              <FormField
                label="Country Code"
                required
                error={form.formState.errors.countryCode?.message}
              >
                <Select
                  value={form.watch("countryCode")}
                  onValueChange={(value) =>
                    form.setValue("countryCode", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select country code" />
                  </SelectTrigger>

                  <SelectContent>
                    {Array.from(
                      new Map(
                        COUNTRY_CODES.map((code) => [code.value, code]),
                      ).values(),
                    ).map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Mobile Number"
                required
                htmlFor="phoneNumber"
                error={form.formState.errors.phoneNumber?.message}
              >
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber", {
                    onChange: (event) => {
                      const target = event.target as HTMLInputElement;

                      const digits = target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      target.value = digits;

                      form.setValue("phoneNumber", digits, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="Enter mobile number"
                />

                <p className="text-muted-foreground text-xs">
                  Enter 10 digit mobile number
                </p>
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ============================================================
              PROFILE DETAILS
          ============================================================ */}

        <Card className="overflow-hidden">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserRound className="h-5 w-5" />
              Profile Details
            </CardTitle>

            <CardDescription>
              Configure the user's personal profile details.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="max-w-sm">
              <FormField
                label="Gender"
                required
                error={form.formState.errors.gender?.message}
              >
                <Select
                  value={form.watch("gender")}
                  onValueChange={(value) =>
                    form.setValue("gender", value as Gender, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={Gender.MALE}>Male</SelectItem>

                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>

                    <SelectItem value={Gender.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ============================================================
              ACCOUNT & MEMBERSHIP
          ============================================================ */}

        <Card className="overflow-hidden">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Account & Membership
            </CardTitle>

            <CardDescription>
              Manage membership, account access, and permissions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Membership + Account Status */}

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="Membership"
                required
                error={form.formState.errors.membershipType?.message}
              >
                <Select
                  value={form.watch("membershipType")}
                  onValueChange={(value) =>
                    form.setValue("membershipType", value as MembershipType, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={MembershipType.FREE}>Free</SelectItem>

                    <SelectItem value={MembershipType.PREMIUM}>
                      Premium
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Account Status">
                <div className="flex h-10 items-center">
                  <span
                    className={
                      isActive
                        ? "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                    }
                  >
                    {isActive ? "Active" : "Suspended"}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs">
                  Status is determined automatically by account access.
                </p>
              </FormField>
            </div>

            {/* Account Options */}

            <div className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-sm font-semibold">Account Options</h3>

                <p className="text-muted-foreground mt-1 text-sm">
                  Configure access and permissions for this user.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {/* Active User */}

                <label className="hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={(value) =>
                      form.setValue("isActive", Boolean(value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="mt-0.5"
                  />

                  <span className="space-y-1">
                    <span className="block text-sm font-medium">
                      Active User
                    </span>

                    <span className="text-muted-foreground block text-xs leading-relaxed">
                      Allow this user to access their account.
                    </span>
                  </span>
                </label>

                {/* Expert User */}

                <label className="hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors">
                  <Checkbox
                    checked={isExpert}
                    onCheckedChange={(value) =>
                      form.setValue("isExpert", Boolean(value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="mt-0.5"
                  />

                  <span className="space-y-1">
                    <span className="block text-sm font-medium">
                      Expert User
                    </span>

                    <span className="text-muted-foreground block text-xs leading-relaxed">
                      Mark this user as an expert.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* </div> */}
      </FormWrapper>
    </FormProvider>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  htmlFor,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}

        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
