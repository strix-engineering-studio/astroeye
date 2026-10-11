import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import type { FirestoreFilter } from "@/lib/firebase/admin-firestore";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

import { UserCreateData, UserFilters, UserType } from "../types";
import { logger } from "@/lib/logger";

class UsersRepository {
  /**
   * Convert a Firestore timestamp value to a JavaScript Date.
   *
   * Firestore stores timestamps as Timestamp.
   * The application layer works with Date.
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

    return undefined;
  }

  /**
   * Convert a Firestore user document into the application UserType.
   *
   * This keeps Firestore Timestamp objects from leaking
   * into the rest of the application.
   */
  private mapUser(data: Record<string, unknown>): UserType {
    return {
      ...data,

      id: data.id as string,

      createdAt: this.toDate(data.createdAt) ?? new Date(0),

      updatedAt: this.toDate(data.updatedAt),

      deletedAt: this.toDate(data.deletedAt),

      dateOfBirth: this.toDate(data.dateOfBirth) ?? new Date(0),

      lastLoginAt: this.toDate(data.lastLoginAt),

      lastActiveAt: this.toDate(data.lastActiveAt),

      children: Array.isArray(data.children)
        ? data.children.map((child) => ({
            ...(child as Record<string, unknown>),
            dob:
              this.toDate((child as Record<string, unknown>).dob) ??
              new Date(0),
          }))
        : undefined,
    } as UserType;
  }

  async findAll(filters?: UserFilters): Promise<UserType[]> {
    try {
      logger.info("Finding all users with filters:", filters);
      const queryFilters: FirestoreFilter[] = [
        {
          field: "isDeleted",
          operator: "==",
          value: false,
        },
      ];

      if (filters?.membershipType) {
        logger.info(
          "Filtering users by membership type:",
          filters.membershipType,
        );
        queryFilters.push({
          field: "membershipType",
          operator: "==",
          value: filters.membershipType,
        });
      }

      if (filters?.gender) {
        logger.info("Filtering users by gender:", filters.gender);
        queryFilters.push({
          field: "gender",
          operator: "==",
          value: filters.gender,
        });
      }

      if (filters?.relationship) {
        logger.info("Filtering users by relationship:", filters.relationship);
        queryFilters.push({
          field: "relationship",
          operator: "==",
          value: filters.relationship,
        });
      }

      if (filters?.isActive !== undefined) {
        logger.info("Filtering users by isActive:", filters.isActive);
        queryFilters.push({
          field: "isActive",
          operator: "==",
          value: filters.isActive,
        });
      }

      if (filters?.isExpert !== undefined) {
        logger.info("Filtering users by isExpert:", filters.isExpert);
        queryFilters.push({
          field: "isExpert",
          operator: "==",
          value: filters.isExpert,
        });
      }

      const users = await firestoreService.queryDocuments<
        Record<string, unknown>
      >(COLLECTIONS.USERS, {
        filters: queryFilters,
        orderBy: {
          field: filters?.sortBy ?? "createdAt",
          direction: filters?.sortOrder ?? "desc",
        },
        limit: filters?.limit,
      });

      logger.debug("Found users:", users);

      const mappedUsers = users.map((user) => this.mapUser(user));

      if (filters?.search) {
        logger.info("Filtering users by search:", filters.search);
        const search = filters.search.toLowerCase();

        return mappedUsers.filter(
          (user) =>
            user.fullName?.toLowerCase().includes(search) ||
            user.email?.toLowerCase().includes(search) ||
            user.phoneNumber?.toLowerCase().includes(search),
        );
      }

      logger.debug("Returning mapped users:", mappedUsers);

      return mappedUsers;
    } catch (error) {
      logger.error("Error finding users:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<UserType | null> {
    try {
      logger.info("Finding user by ID:", id);
      const users = await firestoreService.getDocumentsByField<
        Record<string, unknown>
      >(COLLECTIONS.USERS, "id", id);

      logger.debug("Found users by ID:", users);

      return users[0] ? this.mapUser(users[0]) : null;
    } catch (error) {
      logger.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserType | null> {
    try {
      logger.info("Finding user by phone number:", phoneNumber);
      const users = await firestoreService.getDocumentsByField<
        Record<string, unknown>
      >(COLLECTIONS.USERS, "phoneNumber", phoneNumber);

      logger.debug("Found users by phone number:", users);
      return users[0] ? this.mapUser(users[0]) : null;
    } catch (error) {
      logger.error("Error finding user by phone number:", error);
      throw error;
    }
  }

  async create(data: UserCreateData): Promise<UserType> {
    try {
      logger.info("Creating user with data:", data);
      const id = `USR_${nanoid(10)}`;
      const firestoreData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      await firestoreService.setDocument(COLLECTIONS.USERS, id, {
        ...firestoreData,
        id,

        isActive: data.isActive ?? true,
        isExpert: data.isExpert ?? false,
        isDeleted: false,

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      logger.debug("User document created with ID:", id);

      const user = await this.findById(id);

      if (!user) {
        logger.error("Failed to create user with ID:", id);
        throw new Error("Failed to create user");
      }

      logger.info("Successfully created user with ID:", id);

      return user;
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<Omit<UserType, "id" | "createdAt" | "updatedAt">>,
  ): Promise<UserType> {
    try {
      logger.info("Updating user with ID:", id, "and data:", data);
      const docRef = await firestoreService.getDocumentReferenceByField(
        COLLECTIONS.USERS,
        "id",
        id,
      );

      if (!docRef) {
        logger.error("User not found with ID:", id);
        throw new Error("User not found");
      }

      logger.debug("Updating user document with ID:", id);
      const firestoreData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );
      await docRef.update({
        ...firestoreData,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updated = await this.findById(id);

      if (!updated) {
        logger.error("Failed to update user with ID:", id);
        throw new Error("User not found");
      }
      logger.info("Successfully updated user with ID:", id);

      return updated;
    } catch (error) {
      logger.error("Error updating user:", error);
      throw error;
    }
  }

  async softDelete(id: string, adminId: string): Promise<UserType> {
    try {
      logger.info("Soft deleting user with ID:", id, "by admin ID:", adminId);
      const docRef = await firestoreService.getDocumentReferenceByField(
        COLLECTIONS.USERS,
        "id",
        id,
      );

      if (!docRef) {
        logger.error("User not found with ID:", id);
        throw new Error("User not found");
      }

      await docRef.update({
        isDeleted: true,
        deletedAt: FieldValue.serverTimestamp(),
        deletedBy: adminId,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const user = await this.findById(id);

      if (!user) {
        logger.error("Failed to soft delete user with ID:", id);
        throw new Error("User not found");
      }

      logger.info("Successfully soft deleted user with ID:", id);
      return user;
    } catch (error) {
      logger.error("Error soft deleting user:", error);
      throw error;
    }
  }

  async restore(id: string): Promise<UserType> {
    try {
      logger.info("Restoring user with ID:", id);
      const docRef = await firestoreService.getDocumentReferenceByField(
        COLLECTIONS.USERS,
        "id",
        id,
      );

      if (!docRef) {
        logger.error("User not found with ID:", id);
        throw new Error("User not found");
      }

      await docRef.update({
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const user = await this.findById(id);

      if (!user) {
        logger.error("Failed to restore user with ID:", id);
        throw new Error("User not found");
      }

      logger.info("Successfully restored user with ID:", id);
      return user;
    } catch (error) {
      logger.error("Error restoring user:", error);
      throw error;
    }
  }
}

export const usersRepository = new UsersRepository();
