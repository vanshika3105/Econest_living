import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// Make sure to set FIREBASE_SERVICE_ACCOUNT_KEY environment variable
// Or create a service account JSON file

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
);

if (Object.keys(serviceAccount).length > 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized');
} else {
  console.warn('Firebase Admin SDK not initialized - set FIREBASE_SERVICE_ACCOUNT_KEY');
}

export const getFirebaseAuth = () => admin.auth();
export default admin;
