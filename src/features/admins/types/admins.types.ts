export interface IAdminUser {
  id: string; // Firestore doc id (PK)
  email: string;
  fullName: string;
  displayName?: string;

  password?: string;
  isActive: boolean;
  createdAt: Date | string; // Firestore server timestamp or API JSON value
}

export interface ILoginPayload {
  email: string;
  password: string;
}
