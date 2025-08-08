import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Converts Firestore document data to a typed entity with id
 */
export function firestoreDocToEntity<T extends { id: string }>(
  doc: DocumentSnapshot | QueryDocumentSnapshot
): T | null {
  if (!doc.exists()) {
    return null;
  }
  
  return {
    id: doc.id,
    ...doc.data(),
  } as T;
}

/**
 * Converts Firestore documents array to typed entities array
 */
export function firestoreDocsToEntities<T extends { id: string }>(
  docs: QueryDocumentSnapshot[]
): T[] {
  return docs.map(doc => firestoreDocToEntity<T>(doc)!);
}

/**
 * Strips the id field from an entity for Firestore creation/update
 * (Firestore auto-generates the document ID)
 */
export function stripIdForFirestore<T extends { id: string }>(
  entity: Omit<T, 'id'>
): Omit<T, 'id'> {
  return entity;
} 