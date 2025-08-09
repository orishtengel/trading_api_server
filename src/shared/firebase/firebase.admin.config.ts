import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = require("../../../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com/`,
  });
}
const app = admin.app();

// Get Admin Auth instance
export const adminAuth = admin.auth();

// Get Firestore instance (uses default database)
export const db = getFirestore(app, "tradingdb") //  admin.firestore(app);

export default admin; 