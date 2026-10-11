import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { adminAuth } from "@/lib/firebase/admin";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { logger } from "@/lib/logger";

import { AdminUser, AdminUserFormData } from "../schemas";

class AdminUserRepository {
  /**
   * Convert a Firestore timestamp value into a JavaScript Date.
   *
   * Firestore returns Timestamp objects from the Admin SDK.
   * The application/UI layer should work with Date objects instead.
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

    /**
     * Support serialized Firestore timestamps in case the
     * service layer returns {_seconds, _nanoseconds}.
     */
    if (typeof value === "object" && value !== null && "_seconds" in value) {
      const seconds = Number((value as { _seconds?: unknown })._seconds);

      const nanoseconds = Number(
        (value as { _nanoseconds?: unknown })._nanoseconds ?? 0,
      );

      if (Number.isFinite(seconds)) {
        return new Date(seconds * 1000 + Math.floor(nanoseconds / 1_000_000));
      }
    }

    /**
     * Support ISO/date strings if the data has already been
     * serialized before reaching this repository.
     */
    if (typeof value === "string") {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    return undefined;
  }

  /**
   * Convert a Firestore admin document into the application
   * AdminUser model.
   *
   * This prevents Firestore Timestamp objects from leaking
   * into the UI.
   */
  private normalize(data: Record<string, unknown>): AdminUser {
    const createdAt = this.toDate(data.createdAt);

    const updatedAt = this.toDate(data.updatedAt);

    return {
      ...data,

      id:
        typeof data.id === "string"
          ? data.id
          : typeof data.uid === "string"
            ? data.uid
            : "",

      fullName:
        typeof data.fullName === "string"
          ? data.fullName
          : typeof data.displayName === "string"
            ? data.displayName
            : "",

      email: typeof data.email === "string" ? data.email : "",

      isActive: typeof data.isActive === "boolean" ? data.isActive : true,

      createdAt: createdAt ?? new Date(0),

      updatedAt,

      deletedAt: this.toDate(data.deletedAt),
    } as AdminUser;
  }

  /**
   * Get all admin users.
   *
   * Firestore timestamps are normalized to Date before
   * returning the data.
   */
  async findAll(): Promise<AdminUser[]> {
    try {
      logger.info("Finding all admin users");
      const admins = await firestoreService.getDocuments<
        Record<string, unknown>
      >(COLLECTIONS.ADMIN_USERS);

      logger.debug("Found admin users:");
      const mappedAdmins = admins.map((admin) => this.normalize(admin));
      logger.debug({ mappedAdmins }, "Returning mapped admin users");
      return mappedAdmins;
    } catch (error) {
      logger.error({ error }, "Error finding all admin users");
      throw error;
    }
  }

  /**
   * Get an admin user by Firebase Auth UID /
   * Firestore document ID.
   */
  async findById(id: string): Promise<AdminUser | null> {
    try {
      logger.info({ id }, "Finding admin user by ID");
      const admin = await firestoreService.getDocument<Record<string, unknown>>(
        COLLECTIONS.ADMIN_USERS,
        id,
      );

      if (!admin) {
        logger.warn({ id }, "Admin user not found for ID");
        return null;
      }

      logger.debug({ admin }, "Found admin user by ID");
      return this.normalize({
        ...admin,
        id,
      });
    } catch (error) {
      logger.error({ id, error }, "Error finding admin user by ID");
      throw error;
    }
  }

  /**
   * Create a new admin user.
   *
   * Firebase Authentication is created first because the
   * Firebase Auth UID is used as the Firestore document ID.
   */
  async create(data: AdminUserFormData): Promise<AdminUser> {
    try {
      logger.info(
        { email: data.email, fullName: data.fullName },
        "Creating admin user with data",
      );

      /**
       * 1. Create Firebase Authentication account.
       */
      const user = await adminAuth.createUser({
        email: data.email,
        password: data.password,
        displayName: data.fullName,
        disabled: false,
      });

      logger.debug({ uid: user.uid }, "Created Firebase Auth user");

      try {
        /**
         * 2. Create Firestore admin profile.
         *
         * The Firebase Auth UID is the document ID.
         *
         * Password is intentionally NOT stored in Firestore.
         */
        await firestoreService.setDocument(COLLECTIONS.ADMIN_USERS, user.uid, {
          email: data.email,
          fullName: data.fullName,
          isActive: true,

          createdAt: FieldValue.serverTimestamp(),

          updatedAt: FieldValue.serverTimestamp(),
        });

        logger.debug({ uid: user.uid }, "Created Firestore admin document");

        /**
         * 3. Read the document back.
         *
         * This gives us the resolved Firestore timestamps,
         * which normalize() converts to JavaScript Date.
         */
        const admin = await this.findById(user.uid);

        if (!admin) {
          logger.error({ uid: user.uid }, "Failed to create admin profile");
          throw new Error("Failed to create admin profile");
        }

        logger.info({ uid: user.uid }, "Successfully created admin user");
        return admin;
      } catch (error) {
        /**
         * Firestore creation failed after Firebase Auth
         * succeeded.
         *
         * Roll back the Auth account to avoid an orphaned
         * Firebase Authentication user.
         */
        try {
          logger.warn({ uid: user.uid }, "Rolling back Firebase Auth user");
          await adminAuth.deleteUser(user.uid);
        } catch (rollbackError) {
          logger.error(
            { rollbackError, uid: user.uid },
            "Failed to rollback Firebase Auth user after Firestore creation failed",
          );
        }

        throw error;
      }
    } catch (error) {
      logger.error({ error }, "Error creating admin user");
      throw error;
    }
  }

  /**
   * Update an existing admin user.
   *
   * Authentication-related fields are updated in Firebase Auth.
   * Profile fields are updated in Firestore.
   *
   * Password is NEVER written to Firestore.
   */
  async update(
    id: string,
    data: Partial<AdminUserFormData> & {
      isActive?: boolean;
    },
  ): Promise<AdminUser> {
    try {
      logger.info(
        {
          id,
          email: data.email,
          fullName: data.fullName,
          isActive: data.isActive,
        },
        "Updating admin user with data",
      );

      /**
       * ---------------------------------------------------------
       * Firebase Authentication update
       * ---------------------------------------------------------
       */
      const authUpdates: {
        email?: string;
        password?: string;
        displayName?: string;
        disabled?: boolean;
      } = {};

      if (data.email) {
        authUpdates.email = data.email;
      }

      if (data.password) {
        authUpdates.password = data.password;
      }

      if (data.fullName) {
        authUpdates.displayName = data.fullName;
      }

      if (data.isActive !== undefined) {
        authUpdates.disabled = !data.isActive;
      }

      if (Object.keys(authUpdates).length > 0) {
        logger.debug({ id }, "Updating Firebase Auth user");
        await adminAuth.updateUser(id, authUpdates);
      }

      /**
       * ---------------------------------------------------------
       * Firestore update
       * ---------------------------------------------------------
       *
       * Password must NEVER be stored in Firestore.
       */
      const firestoreData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "password"),
      ) as Partial<AdminUser>;

      logger.debug({ id }, "Updating Firestore document");
      await firestoreService.updateDocument(COLLECTIONS.ADMIN_USERS, id, {
        ...firestoreData,

        updatedAt: FieldValue.serverTimestamp(),
      });

      /**
       * Return the normalized document so the UI receives
       * JavaScript Date objects instead of Firestore Timestamp.
       */
      const admin = await this.findById(id);

      if (!admin) {
        logger.error({ id }, "Admin user not found after update");
        throw new Error("Admin user not found");
      }

      logger.info({ id }, "Successfully updated admin user");
      return admin;
    } catch (error) {
      logger.error({ id, error }, "Error updating admin user");
      throw error;
    }
  }

  /**
   * Delete an admin user.
   *
   * Firebase Authentication is deleted first.
   * Firestore profile is then deleted.
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info({ id }, "Deleting admin user");

      /**
       * 1. Delete Firebase Authentication account.
       */
      logger.debug({ id }, "Deleting Firebase Auth user");
      await adminAuth.deleteUser(id);

      /**
       * 2. Delete Firestore admin profile.
       */
      logger.debug({ id }, "Deleting Firestore admin document");
      await firestoreService.deleteDocument(COLLECTIONS.ADMIN_USERS, id);

      logger.info({ id }, "Successfully deleted admin user");
    } catch (error) {
      logger.error({ id, error }, "Error deleting admin user");
      throw error;
    }
  }
}

export const adminUsersRepository = new AdminUserRepository();
