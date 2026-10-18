import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { verifySession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";

export async function PATCH(request: Request) {
  const uid = await verifySession();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const input: unknown = await request.json();
    if (!input || typeof input !== "object" || Array.isArray(input)) return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
    const body = input as Record<string, unknown>;
    const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
    if (body.fullName !== undefined) {
      if (typeof body.fullName !== "string" || body.fullName.trim().length < 2 || body.fullName.trim().length > 80) return NextResponse.json({ error: "Name must be between 2 and 80 characters." }, { status: 400 });
      update.fullName = body.fullName.trim();
    }
    if (body.preferences !== undefined) {
      const value = body.preferences;
      if (!value || typeof value !== "object" || Array.isArray(value)) return NextResponse.json({ error: "Invalid preferences." }, { status: 400 });
      const preferences = value as Record<string, unknown>;
      const booleanKeys = ["notificationsEnabled", "emailNotificationsEnabled", "smsNotificationsEnabled"];
      if (booleanKeys.some((key) => typeof preferences[key] !== "boolean") || (preferences.themeMode !== undefined && !["LIGHT", "DARK", "SYSTEM"].includes(String(preferences.themeMode))) || (preferences.languageCode !== undefined && typeof preferences.languageCode !== "string")) return NextResponse.json({ error: "Invalid preferences." }, { status: 400 });
      update.preferences = {
        themeMode: preferences.themeMode ?? "SYSTEM",
        languageCode: typeof preferences.languageCode === "string" ? preferences.languageCode.slice(0, 12) : "en",
        notificationsEnabled: preferences.notificationsEnabled,
        emailNotificationsEnabled: preferences.emailNotificationsEnabled,
        smsNotificationsEnabled: preferences.smsNotificationsEnabled,
        biometricEnabled: false,
      };
    }
    if (Object.keys(update).length === 1) return NextResponse.json({ error: "No settings to update." }, { status: 400 });
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return NextResponse.json({ error: "Customer profile not found." }, { status: 404 });
    await userRef.update(update);
    const updated = await userRef.get();
    const data = updated.data();
    return NextResponse.json({ success: true, fullName: data?.fullName ?? "", preferences: data?.preferences ?? {} });
  } catch (error) {
    console.error("Unable to update customer settings:", error);
    return NextResponse.json({ error: "Unable to update settings." }, { status: 500 });
  }
}
