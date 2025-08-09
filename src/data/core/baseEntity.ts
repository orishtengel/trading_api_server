export interface BaseEntity {
  id: string; // Firestore document ID
  createdAt: string; // ISO string format for persistence
  updatedAt: string; // ISO string format for persistence
}
