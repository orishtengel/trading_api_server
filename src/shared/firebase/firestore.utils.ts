import { DocumentSnapshot } from '@google-cloud/firestore';

export function firestoreDocToEntity<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as T;
}

// Remove undefined values from objects to prevent Firestore errors
export function removeUndefinedValues<T extends Record<string, any>>(obj: T): T {
  const cleaned = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        // Recursively clean nested objects
        cleaned[key as keyof T] = removeUndefinedValues(value);
      } else if (Array.isArray(value)) {
        // Clean arrays by removing undefined elements and cleaning nested objects
        cleaned[key as keyof T] = value
          .filter(item => item !== undefined)
          .map(item => 
            item && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Date)
              ? removeUndefinedValues(item)
              : item
          ) as T[keyof T];
      } else {
        cleaned[key as keyof T] = value;
      }
    }
  }
  
  return cleaned;
} 