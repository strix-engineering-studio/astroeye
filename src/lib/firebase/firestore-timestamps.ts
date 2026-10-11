import { Timestamp } from "firebase-admin/firestore";

import { toDateValue } from "@/lib/datetime";

const firestoreDateFields = [
  "scheduledAt",
  "endAt",
  "createdAt",
  "updatedAt",
  "registeredAt",
  "joinedAt",
  "leftAt",
  "verifiedAt",
  "capturedAt",
  "purchasedAt",
];

export function toFirestoreTimestamp(value: unknown): Timestamp | null {
  const date = toDateValue(value);
  return date ? Timestamp.fromDate(date) : null;
}

export function toFirestoreTimestampOrNow(value: unknown): Timestamp {
  return toFirestoreTimestamp(value) ?? Timestamp.now();
}

export function normalizeFirestoreDateFields<T extends Record<string, unknown>>(
  data: T,
): T {
  const normalized = { ...data } as Record<string, unknown>;

  for (const field of firestoreDateFields) {
    const value = normalized[field];

    if (value === undefined || value === null || value === "") {
      continue;
    }

    const timestamp = toFirestoreTimestamp(value);

    if (timestamp) {
      normalized[field] = timestamp;
    }
  }

  return normalized as T;
}
