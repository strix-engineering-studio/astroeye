import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { logger } from "@/lib/logger";
import { Coupon, CouponFormData, UpdateCouponData } from "../types/coupon.type";

class CouponRepository {
  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private toDate(value: unknown): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;

    if (typeof value === "object" && value !== null && "_seconds" in value) {
      const ts = value as { _seconds?: unknown; _nanoseconds?: unknown };
      const s = Number(ts._seconds);
      const ns = Number(ts._nanoseconds ?? 0);
      if (Number.isFinite(s)) {
        return new Date(s * 1000 + Math.floor(ns / 1_000_000));
      }
    }

    if (typeof value === "string") {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) return d;
    }

    return undefined;
  }

  private toNullableDate(value: unknown): Date | null {
    return this.toDate(value) ?? null;
  }

  private toNumber(value: unknown, fallback: number): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  /** Normalize a Firestore document into the application Coupon model. */
  private normalize(data: Record<string, unknown>): Coupon {
    return {
      id: typeof data.id === "string" ? data.id : "",
      code: typeof data.code === "string" ? data.code : "",
      description:
        typeof data.description === "string" ? data.description : undefined,
      discountType:
        data.discountType === "percentage" || data.discountType === "fixed"
          ? data.discountType
          : "fixed",
      discountValue: this.toNumber(data.discountValue, 0),
      minOrderAmount: this.toNumber(data.minOrderAmount, 0),
      maxDiscountAmount: this.toNullableNumber(data.maxDiscountAmount),
      usageLimit: this.toNullableNumber(data.usageLimit),
      usageCount: this.toNumber(data.usageCount, 0),
      startsAt: this.toNullableDate(data.startsAt),
      expiresAt: this.toNullableDate(data.expiresAt),
      isActive: typeof data.isActive === "boolean" ? data.isActive : false,
      createdAt: this.toDate(data.createdAt),
      updatedAt: this.toDate(data.updatedAt),
    };
  }

  /** Convert a JS Date (or null) to a Firestore Timestamp (or null). */
  private toTimestamp(value: Date | null | undefined): Timestamp | null {
    if (!value) return null;
    return Timestamp.fromDate(value);
  }

  // ---------------------------------------------------------------------------
  // Query methods
  // ---------------------------------------------------------------------------

  async findAll(): Promise<Coupon[]> {
    try {
      logger.info("Finding all coupons");
      const docs = await firestoreService.getDocumentsOrdered<
        Record<string, unknown>
      >(COLLECTIONS.COUPONS, "createdAt", undefined, "desc");
      return docs.map((d) => this.normalize(d));
    } catch (error) {
      logger.error({ error }, "Error finding all coupons");
      throw error;
    }
  }

  async findById(id: string): Promise<Coupon | null> {
    try {
      logger.info({ id }, "Finding coupon by ID");
      const doc = await firestoreService.getDocument<Record<string, unknown>>(
        COLLECTIONS.COUPONS,
        id,
      );
      if (!doc) {
        logger.warn({ id }, "Coupon not found");
        return null;
      }
      return this.normalize({ ...doc, id });
    } catch (error) {
      logger.error({ id, error }, "Error finding coupon by ID");
      throw error;
    }
  }

  async findByCode(code: string): Promise<Coupon | null> {
    try {
      logger.info({ code }, "Finding coupon by code");
      const ref = await firestoreService.getDocumentReferenceByField(
        COLLECTIONS.COUPONS,
        "code",
        code.toUpperCase(),
      );
      if (!ref) {
        logger.warn({ code }, "Coupon not found for code");
        return null;
      }
      return this.findById(ref.id);
    } catch (error) {
      logger.error({ code, error }, "Error finding coupon by code");
      throw error;
    }
  }

  async findActive(): Promise<Coupon[]> {
    try {
      logger.info("Finding active coupons");
      const docs = await firestoreService.queryDocuments<
        Record<string, unknown>
      >(COLLECTIONS.COUPONS, {
        filters: [{ field: "isActive", operator: "==", value: true }],
        orderBy: { field: "createdAt", direction: "desc" },
      });
      return docs.map((d) => this.normalize(d));
    } catch (error) {
      logger.error({ error }, "Error finding active coupons");
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // Mutation methods
  // ---------------------------------------------------------------------------

  async create(data: CouponFormData): Promise<Coupon> {
    try {
      logger.info({ code: data.code }, "Creating coupon");
      const payload = {
        ...data,
        code: data.code.toUpperCase(),
        usageCount: 0,
        startsAt: this.toTimestamp(data.startsAt),
        expiresAt: this.toTimestamp(data.expiresAt),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const created = await firestoreService.addDocument<
        Record<string, unknown>
      >(
        COLLECTIONS.COUPONS,
        payload as Omit<Record<string, unknown>, "id">,
      );

      const coupon = await this.findById(created.id as string);
      if (!coupon) throw new Error("Failed to retrieve created coupon");

      logger.info({ id: coupon.id, code: coupon.code }, "Coupon created");
      return coupon;
    } catch (error) {
      logger.error({ error }, "Error creating coupon");
      throw error;
    }
  }

  async update(id: string, data: UpdateCouponData): Promise<Coupon> {
    try {
      logger.info({ id }, "Updating coupon");
      const existing = await this.findById(id);
      if (!existing) throw new Error("Coupon not found");

      const payload: Record<string, unknown> = {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      };

      // Normalise dates to Timestamps when provided
      if ("startsAt" in data) {
        payload.startsAt = this.toTimestamp(data.startsAt ?? null);
      }
      if ("expiresAt" in data) {
        payload.expiresAt = this.toTimestamp(data.expiresAt ?? null);
      }
      if (data.code) {
        payload.code = data.code.toUpperCase();
      }

      await firestoreService.updateDocument(COLLECTIONS.COUPONS, id, payload);

      const updated = await this.findById(id);
      if (!updated) throw new Error("Failed to retrieve updated coupon");

      logger.info({ id }, "Coupon updated");
      return updated;
    } catch (error) {
      logger.error({ id, error }, "Error updating coupon");
      throw error;
    }
  }

  async incrementUsage(id: string): Promise<void> {
    try {
      await firestoreService.updateDocument(COLLECTIONS.COUPONS, id, {
        usageCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      logger.error({ id, error }, "Error incrementing coupon usage");
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      logger.info({ id }, "Deleting coupon");
      const existing = await this.findById(id);
      if (!existing) throw new Error("Coupon not found");
      await firestoreService.deleteDocument(COLLECTIONS.COUPONS, id);
      logger.info({ id }, "Coupon deleted");
    } catch (error) {
      logger.error({ id, error }, "Error deleting coupon");
      throw error;
    }
  }
}

export const couponsRepository = new CouponRepository();
