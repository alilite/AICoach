/**
 * Imports the Firebase Admin SDK to initialize and manage Firebase services.
 * Provides server-side authentication, database, and other administrative capabilities.
 */
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
