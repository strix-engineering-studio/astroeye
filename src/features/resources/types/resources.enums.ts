/**
 * Enums for Resource-related types
 * These enums provide type safety for fixed value sets in the resource domain
 */

export enum ResourceCategory {
  GUIDES = "GUIDES",
  TEMPLATES = "TEMPLATES",
  CHECKLISTS = "CHECKLISTS",
  ACTIVITY_SHEETS = "ACTIVITY_SHEETS",
  WORKSHEETS = "WORKSHEETS",
  EBOOKS = "EBOOKS",
  VIDEOS = "VIDEOS",
  AUDIO = "AUDIO",
  IMAGES = "IMAGES",
  OTHER = "OTHER",
}

export enum ResourceFileType {
  PDF = "PDF",
  DOCX = "DOCX",
  XLSX = "XLSX",
  PPTX = "PPTX",
  ZIP = "ZIP",
  PNG = "PNG",
  JPG = "JPG",
  JPEG = "JPEG",
  MP4 = "MP4",
  MP3 = "MP3",
  TEXT = "TEXT",
}

export enum ResourceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING_REVIEW = "PENDING_REVIEW",
  REJECTED = "REJECTED",
}

export enum ResourceVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PREMIUM_ONLY = "PREMIUM_ONLY",
}

// Array of all category values for use in dropdowns
export const CATEGORY_OPTIONS = Object.values(ResourceCategory);

// Array of all file type values for use in dropdowns
export const FILE_TYPE_OPTIONS = Object.values(ResourceFileType);

// File type to MIME type mapping
export const FILE_TYPE_MIME_MAP: Record<ResourceFileType, string> = {
  [ResourceFileType.PDF]: "application/pdf",
  [ResourceFileType.DOCX]:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  [ResourceFileType.XLSX]:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  [ResourceFileType.PPTX]:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  [ResourceFileType.ZIP]: "application/zip",
  [ResourceFileType.PNG]: "image/png",
  [ResourceFileType.JPG]: "image/jpeg",
  [ResourceFileType.JPEG]: "image/jpeg",
  [ResourceFileType.MP4]: "video/mp4",
  [ResourceFileType.MP3]: "audio/mpeg",
  [ResourceFileType.TEXT]: "text/plain",
};

// Allowed file extensions for upload
export const ALLOWED_EXTENSIONS = [
  "pdf",
  "docx",
  "xlsx",
  "pptx",
  "zip",
  "png",
  "jpg",
  "jpeg",
  "mp4",
  "mp3",
  "txt",
];

// Maximum file size in bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
