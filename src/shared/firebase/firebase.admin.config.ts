import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// In Firebase Functions, use default credentials
// In local development, you might need a service account key
if (!admin.apps.length) {
  if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'development') {
    // For local development, try to load service account key
    try {
      const serviceAccount = require("../../../serviceAccountKey.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com/`,
      });
    } catch (error) {
      console.warn('Service account key not found, using default credentials');
      admin.initializeApp();
    }
  } else {
    // In production/Firebase Functions, use default application credentials
    admin.initializeApp();
  }
}
const app = admin.app();

// Get Admin Auth instance
export const adminAuth = admin.auth();

// Get Firestore instance (uses default database)
export const db = getFirestore(app, "tradingdb") //  admin.firestore(app);

export default admin; 