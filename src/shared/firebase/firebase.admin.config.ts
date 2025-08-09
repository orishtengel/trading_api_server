var admin = require("firebase-admin");

var serviceAccount = require("../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Admin Auth instance
export const adminAuth = admin.auth();

export const db = admin.firestore();

export default admin; 