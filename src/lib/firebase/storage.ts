// src/firebase/storage.ts

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadMetadata,
} from "firebase/storage";

import { app, firebaseConfig } from "./config";

export interface StorageAssetReference {
  url: string;
  path: string;
}

class FirebaseStorageService {
  private get storage() {
    return getStorage(app, firebaseConfig.storageBucket);
  }

  /**
   * Upload a file to Firebase Storage.
   *
   * @param folder e.g. "feed", "avatars", "groups"
   * @param file File object
   * @param metadata Optional Firebase metadata
   */
  async uploadFile(
    folder: string,
    file: File,
    metadata?: UploadMetadata,
  ): Promise<string> {
    const asset = await this.uploadFileWithReference(folder, file, metadata);
    return asset.url;
  }

  async uploadFileWithReference(
    folder: string,
    file: File,
    metadata?: UploadMetadata,
  ): Promise<StorageAssetReference> {
    if (!this.storage) {
      throw new Error("Firebase Storage has not been initialized.");
    }

    const extension = file.name.split(".").pop();

    const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const path = `${folder}/${filename}`;

    const storageRef = ref(this.storage, path);

    const snapshot = await uploadBytesResumable(storageRef, file, metadata);

    return {
      url: await getDownloadURL(snapshot.ref),
      path,
    };
  }

  /**
   * Upload multiple files.
   */
  async uploadFiles(
    folder: string,
    files: File[],
    metadata?: UploadMetadata,
  ): Promise<string[]> {
    return Promise.all(
      files.map((file) => this.uploadFile(folder, file, metadata)),
    );
  }

  /**
   * Delete by storage path.
   *
   * Example:
   * feed/172345678-image.png
   */
  async deleteFile(path: string): Promise<void> {
    if (!this.storage) {
      throw new Error("Firebase Storage has not been initialized.");
    }

    const storageRef = ref(this.storage, path);

    await deleteObject(storageRef);
  }

  /**
   * Delete using a Firebase download URL.
   */
  async deleteByUrl(downloadUrl: string): Promise<void> {
    const path = this.getStoragePath(downloadUrl);

    if (!path) return;

    await this.deleteFile(path);
  }

  /**
   * Convert a Firebase download URL into a storage path.
   */
  getStoragePath(downloadUrl: string): string | null {
    try {
      const url = new URL(downloadUrl);

      const configuredBucket = app.options.storageBucket;
      const isFirebaseStorageHost =
        url.hostname === "firebasestorage.googleapis.com" ||
        url.hostname === "firebasestorage.app" ||
        (configuredBucket !== undefined && url.hostname === configuredBucket);
      if (!isFirebaseStorageHost) return null;

      const match = url.pathname.match(/\/o\/(.+)/);

      if (!match) return null;

      return decodeURIComponent(match[1]);
    } catch {
      return null;
    }
  }

  // Inside src/firebase/storage.ts in your FirebaseStorageService class:

  /**
   * Upload a single file specifically for feed posts.
   * Path: "feed_posts/{timestamp}-{uuid}.{ext}"
   */
  async uploadFeedPostFile(
    file: File,
    metadata?: UploadMetadata,
  ): Promise<string> {
    return this.uploadFile("feed_posts", file, metadata);
  }

  /**
   * Upload multiple files for a feed post in parallel.
   * Returns an array of Firebase download URLs.
   */
  async uploadFeedPostFiles(
    files: File[],
    metadata?: UploadMetadata,
  ): Promise<string[]> {
    return this.uploadFiles("feed_posts", files, metadata);
  }
}

export const storageService = new FirebaseStorageService();
