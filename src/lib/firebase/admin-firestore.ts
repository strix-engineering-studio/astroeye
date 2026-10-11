import "server-only";

import { COLLECTIONS } from "../constants/COLLECTIONS";
import { adminDb } from "./admin";
import {
  FieldValue,
  Query,
  QueryDocumentSnapshot,
  Timestamp,
  WhereFilterOp,
} from "firebase-admin/firestore";
import { logger } from "@/lib/logger";

export interface FirestoreFilter {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}

export interface FirestoreOrderBy {
  field: string;
  direction?: "asc" | "desc";
}

export interface FirestoreQueryOptions {
  filters?: FirestoreFilter[];
  orderBy?: FirestoreOrderBy;
  limit?: number;
  startAfter?: unknown;
}

export class AdminFirestoreService {
  /**
   * Get all documents from a collection
   */
  async getDocuments<T>(collectionName: string): Promise<T[]> {
    try {
      const colRef = adminDb.collection(collectionName);
      const snapshot = await colRef.get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data() as any;

        return {
          ...(data as T),
          id: data?.id ?? doc.id,
        } as T;
      });
    } catch (error: any) {
      logger.error(`Error fetching documents from ${collectionName}:`, error);
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  /**
   * Get documents filtered by a field value
   */
  async getDocumentsByField<T>(
    collectionName: string,
    field: string,
    value: any,
  ): Promise<T[]> {
    try {
      const colRef = adminDb.collection(collectionName);
      const snapshot = await colRef.where(field, "==", value).get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data() as any;

        return {
          ...(data as T),
          id: data?.id ?? doc.id,
        } as T;
      });
    } catch (error: any) {
      logger.error(
        `Error fetching documents by field ${field}=${value}:`,
        error,
      );
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocument<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      const data = docSnap.data() as any;

      return {
        ...(data as T),
        id: data?.id ?? docSnap.id,
      } as T;
    } catch (error: any) {
      logger.error(
        `Error fetching document ${id} from ${collectionName}:`,
        error,
      );
      throw new Error(`Failed to fetch document: ${error.message}`);
    }
  }

  /**
   * Find a Firestore document reference by a field value.
   */
  async getDocumentReferenceByField(
    collectionName: string,
    field: string,
    value: unknown,
  ) {
    try {
      const snapshot = await adminDb
        .collection(collectionName)
        .where(field, "==", value)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      return snapshot.docs[0].ref;
    } catch (error: any) {
      logger.error(`Error finding document by ${field}=${value}:`, error);
      throw new Error(`Failed to find document: ${error.message}`);
    }
  }
  /**
   * Add a new document to a collection
   */
  async addDocument<T>(
    collectionName: string,
    data: Omit<T, "id">,
  ): Promise<T> {
    try {
      const colRef = adminDb.collection(collectionName);
      const docRef = await colRef.add(data);

      return {
        id: docRef.id,
        ...data,
      } as T;
    } catch (error: any) {
      logger.error(`Error adding document to ${collectionName}:`, error);
      throw new Error(`Failed to add document: ${error.message}`);
    }
  }

  /**
   * Add or overwrite a document with a known ID.
   */
  async setDocument<T>(
    collectionName: string,
    id: string,
    data: Omit<T, "id">,
  ): Promise<T> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);

      await docRef.set(data);

      return {
        id: docRef.id,
        ...data,
      } as T;
    } catch (error: any) {
      logger.error(`Error setting document ${id} in ${collectionName}:`, error);

      throw new Error(`Failed to set document: ${error.message}`);
    }
  }

  /**
   * Update a document
   */
  async updateDocument<T>(
    collectionName: string,
    id: string,
    data: Partial<T>,
  ): Promise<T> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);
      await docRef.update(data);

      // Fetch and return the updated document
      const updatedDoc = await this.getDocument<T>(collectionName, id);

      if (!updatedDoc) {
        throw new Error("Failed to retrieve updated document");
      }

      return updatedDoc;
    } catch (error: any) {
      logger.error(
        `Error updating document ${id} in ${collectionName}:`,
        error,
      );
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);
      await docRef.delete();
    } catch (error: any) {
      logger.error(
        `Error deleting document ${id} from ${collectionName}:`,
        error,
      );
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Get documents ordered by a field and limited
   */
  async getDocumentsOrdered<T>(
    collectionName: string,
    orderByField: string,
    limitCount?: number,
    direction: "asc" | "desc" = "desc",
  ): Promise<T[]> {
    try {
      const colRef = adminDb.collection(collectionName);
      let queryRef = colRef.orderBy(orderByField, direction);

      if (limitCount) {
        queryRef = queryRef.limit(limitCount);
      }

      const snapshot = await queryRef.get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data() as any;

        return {
          ...(data as T),
          id: data?.id ?? doc.id,
        } as T;
      });
    } catch (error: any) {
      logger.error(
        `Error fetching ordered documents from ${collectionName}:`,
        error,
      );
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  /**
   * Query documents with filters, ordering and pagination
   */
  async queryDocuments<T>(
    collectionName: string,
    options: FirestoreQueryOptions = {},
  ): Promise<T[]> {
    const mapSnapshot = (snapshot: FirebaseFirestore.QuerySnapshot): T[] => {
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data() as any;

        return {
          ...(data as T),
          id: data?.id ?? doc.id,
        } as T;
      });
    };

    const sortItems = (
      items: T[],
      field: string,
      direction: "asc" | "desc",
    ) => {
      return [...items].sort((leftItem, rightItem) => {
        const leftValue = (leftItem as Record<string, unknown>)[field];
        const rightValue = (rightItem as Record<string, unknown>)[field];

        const normalize = (value: unknown): number | string => {
          if (value instanceof Timestamp) {
            return value.toMillis();
          }

          if (value instanceof Date) {
            return value.getTime();
          }

          if (typeof value === "number") {
            return value;
          }

          if (typeof value === "string") {
            const date = new Date(value);

            if (!Number.isNaN(date.getTime())) {
              return date.getTime();
            }

            return value.toLowerCase();
          }

          if (typeof value === "boolean") {
            return value ? 1 : 0;
          }

          return 0;
        };

        const left = normalize(leftValue);
        const right = normalize(rightValue);

        if (typeof left === "string" && typeof right === "string") {
          const result = left.localeCompare(right);
          return direction === "desc" ? -result : result;
        }

        const result = Number(left ?? 0) - Number(right ?? 0);
        return direction === "desc" ? -result : result;
      });
    };

    const buildQuery = (withOrderBy: boolean, applyLimit = true): Query => {
      let query: Query = adminDb.collection(collectionName);

      if (options.filters) {
        for (const filter of options.filters) {
          query = query.where(filter.field, filter.operator, filter.value);
        }
      }

      if (withOrderBy && options.orderBy) {
        query = query.orderBy(
          options.orderBy.field,
          options.orderBy.direction ?? "asc",
        );
      }

      if (options.startAfter) {
        query = query.startAfter(options.startAfter);
      }

      if (applyLimit && options.limit) {
        query = query.limit(options.limit);
      }

      return query;
    };

    try {
      const snapshot = await buildQuery(true).get();
      return mapSnapshot(snapshot);
    } catch (error: any) {
      const isIndexRequiredError =
        typeof error?.message === "string" &&
        /(FAILED_PRECONDITION|requires an index)/i.test(error.message);

      if (isIndexRequiredError && options.orderBy && !options.startAfter) {
        try {
          const fallbackSnapshot = await buildQuery(false, false).get();
          const documents = mapSnapshot(fallbackSnapshot);
          const orderedDocuments = sortItems(
            documents,
            options.orderBy.field,
            options.orderBy.direction ?? "asc",
          );

          if (options.limit) {
            return orderedDocuments.slice(0, options.limit);
          }

          return orderedDocuments;
        } catch (fallbackError: any) {
          logger.error(
            `Error querying documents from ${collectionName}:`,
            fallbackError,
          );
          throw new Error(
            `Failed to query documents: ${fallbackError.message}`,
          );
        }
      }

      logger.error(`Error querying documents from ${collectionName}:`, error);
      throw new Error(`Failed to query documents: ${error.message}`);
    }
  }

  /**
   * Increment a numeric field in a document
   */
  async incrementField(
    collectionName: string,
    id: string,
    field: string,
    amount: number = 1,
  ): Promise<void> {
    try {
      const docRef = adminDb.collection(collectionName).doc(id);
      await docRef.update({
        [field]: FieldValue.increment(amount),
      });
    } catch (error: any) {
      logger.error(
        `Error incrementing field ${field} in document ${id}:`,
        error,
      );
      throw new Error(`Failed to increment field: ${error.message}`);
    }
  }

  /**
   * Check if an admin user exists and is active
   */
  async isActive(uid: string): Promise<boolean> {
    try {
      const doc = await adminDb
        .collection(COLLECTIONS.ADMIN_USERS)
        .doc(uid)
        .get();

      if (!doc.exists) {
        return false;
      }

      const data = doc.data();

      return data?.isActive === true;
    } catch (error: any) {
      logger.error(`Error checking admin status for ${uid}:`, error);
      throw new Error(`Failed to check admin status: ${error.message}`);
    }
  }
}

// Singleton instance
export const firestoreService = new AdminFirestoreService();
