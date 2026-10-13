import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { logger } from "@/lib/logger";
import { Coupon, CouponFormData } from "../types/coupon.type";

class CouponRepository {
  /**
   * Convert a Firestore timestamp or serialized date into a JavaScript Date.
   */
  private toDate(value: unknown): Date | undefined {
    if (!value) {
      return undefined;
    }

    if (value instanceof Timestamp) {
      return value.toDate();
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "object" && value !== null && "_seconds" in value) {
      const timestamp = value as {
        _seconds?: unknown;
        _nanoseconds?: unknown;
      };

      const seconds = Number(timestamp._seconds);
      const nanoseconds = Number(timestamp._nanoseconds ?? 0);

      if (Number.isFinite(seconds) && Number.isFinite(nanoseconds)) {
        return new Date(seconds * 1000 + Math.floor(nanoseconds / 1_000_000));
      }
    }

    if (typeof value === "string") {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    return undefined;
  }

  /**
   * Normalize a Firestore coupon document into the application model.
   */
  private normalize(data: Record<string, unknown>): Coupon {
    const createdAt = this.toDate(data.createdAt);
    const updatedAt = this.toDate(data.updatedAt);
    const expiresAt = this.toDate(data.expiresAt);

    return {
      ...data,
      id: typeof data.id === "string" ? data.id : "",
      code: typeof data.code === "string" ? data.code : "",
      isActive: typeof data.isActive === "boolean" ? data.isActive : false,
      createdAt,
      updatedAt,
      expiresAt,
    } as Coupon;
  }

  /**
   * Get all coupons.
   */
  async findAll(): Promise<Coupon[]> {
    try {
      logger.info("Finding all coupons");

      const coupons = await firestoreService.getDocuments<
        Record<string, unknown>
      >(COLLECTIONS.COUPONS);

      const mappedCoupons = coupons.map((coupon) => this.normalize(coupon));

      logger.debug({ count: mappedCoupons.length }, "Returning all coupons");

      return mappedCoupons;
    } catch (error) {
      logger.error({ error }, "Error finding all coupons");
      throw error;
    }
  }

  /**
   * Get all coupons ordered by creation date.
   */
  async findAllOrdered(): Promise<Coupon[]> {
    try {
      logger.info("Finding coupons ordered by creation date");

      const coupons = await firestoreService.getDocumentsOrdered<
        Record<string, unknown>
      >(COLLECTIONS.COUPONS, "createdAt", undefined, "desc");

      return coupons.map((coupon) => this.normalize(coupon));
    } catch (error) {
      logger.error({ error }, "Error finding ordered coupons");
      throw error;
    }
  }

  /**
   * Find a coupon by Firestore document ID.
   */
  async findById(id: string): Promise<Coupon | null> {
    try {
      logger.info({ id }, "Finding coupon by ID");

      const coupon = await firestoreService.getDocument<
        Record<string, unknown>
      >(COLLECTIONS.COUPONS, id);

      if (!coupon) {
        logger.warn({ id }, "Coupon not found");
        return null;
      }

      return this.normalize({ ...coupon, id });
    } catch (error) {
      logger.error({ id, error }, "Error finding coupon by ID");
      throw error;
    }
  }

  /**
   * Find a coupon by its code.
   */
  async findByCode(code: string): Promise<Coupon | null> {
    try {
      logger.info({ code }, "Finding coupon by code");

      const couponRef = await firestoreService.getDocumentReferenceByField(
        COLLECTIONS.COUPONS,
        "code",
        code,
      );

      if (!couponRef) {
        logger.warn({ code }, "Coupon not found for code");
        return null;
      }

      const coupon = await this.findById(couponRef.id);

      return coupon;
    } catch (error) {
      logger.error({ code, error }, "Error finding coupon by code");
      throw error;
    }
  }

  /**
   * Find active coupons ordered by expiry date.
   *
   * Note: This filters on isActive only. Expired coupons are excluded
   * separately if the caller needs only currently valid coupons.
   */
  async findActive(): Promise<Coupon[]> {
    try {
      logger.info("Finding active coupons");

      const coupons = await firestoreService.queryDocuments<
        Record<string, unknown>
      >(COLLECTIONS.COUPONS, {
        filters: [
          {
            field: "isActive",
            operator: "==",
            value: true,
          },
        ],
        orderBy: {
          field: "expiresAt",
          direction: "desc",
        },
      });

      return coupons.map((coupon) => this.normalize(coupon));
    } catch (error) {
      logger.error({ error }, "Error finding active coupons");
      throw error;
    }
  }

  /**
   * Create a new coupon.
   */
  async create(data: CouponFormData): Promise<Coupon> {
    try {
      logger.info({ code: data.code }, "Creating coupon");

      const couponData = {
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const createdCoupon = await firestoreService.addDocument<
        Record<string, unknown>
      >(COLLECTIONS.COUPONS, couponData as Omit<Record<string, unknown>, "id">);

      const coupon = await this.findById(createdCoupon.id as string);

      if (!coupon) {
        logger.error(
          { id: createdCoupon.id },
          "Failed to retrieve created coupon",
        );

        throw new Error("Failed to retrieve created coupon");
      }

      logger.info(
        { id: coupon.id, code: coupon.code },
        "Successfully created coupon",
      );

      return coupon;
    } catch (error) {
      logger.error({ error }, "Error creating coupon");
      throw error;
    }
  }

  /**
   * Update an existing coupon.
   */
  async update(id: string, data: Partial<CouponFormData>): Promise<Coupon> {
    try {
      logger.info({ id }, "Updating coupon");

      const existingCoupon = await this.findById(id);

      if (!existingCoupon) {
        logger.warn({ id }, "Cannot update coupon: coupon not found");
        throw new Error("Coupon not found");
      }

      await firestoreService.updateDocument(COLLECTIONS.COUPONS, id, {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedCoupon = await this.findById(id);

      if (!updatedCoupon) {
        throw new Error("Failed to retrieve updated coupon");
      }

      logger.info({ id }, "Successfully updated coupon");

      return updatedCoupon;
    } catch (error) {
      logger.error({ id, error }, "Error updating coupon");
      throw error;
    }
  }

  /**
   * Delete an existing coupon.
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info({ id }, "Deleting coupon");

      const existingCoupon = await this.findById(id);

      if (!existingCoupon) {
        logger.warn({ id }, "Cannot delete coupon: coupon not found");
        throw new Error("Coupon not found");
      }

      await firestoreService.deleteDocument(COLLECTIONS.COUPONS, id);

      logger.info({ id }, "Successfully deleted coupon");
    } catch (error) {
      logger.error({ id, error }, "Error deleting coupon");
      throw error;
    }
  }
}

export const couponsRepository = new CouponRepository();
