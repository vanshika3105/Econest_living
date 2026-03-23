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
  console.log('Firebase Admin SDK initialized with full credentials');
} else {
  // Initialize without credentials, only works for token verification
  admin.initializeApp({ projectId: 'econestliving-70066' });
  console.log('Firebase Admin SDK initialized without credentials (token verification only)');
}

export const getFirebaseAuth = () => admin.auth();
export default admin;
