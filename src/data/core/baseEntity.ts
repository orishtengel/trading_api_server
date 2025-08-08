export interface BaseEntity {
  id: string; // Firestore document ID
  created_at: string; // ISO string format for persistence
  updated_at: string; // ISO string format for persistence
}
