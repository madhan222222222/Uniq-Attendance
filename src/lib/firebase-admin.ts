
import * as admin from 'firebase-admin';

// This is a server-only file. It should not be imported into client components.

// Check if the service account key is set in the environment variables
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccount) {
    // This error will be caught during the build process if the variable is not set
    // making it a clear indicator of a missing configuration.
    // In a real production environment, you would want to handle this more gracefully.
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for admin operations.');
}

const serviceAccountJson = JSON.parse(
    Buffer.from(serviceAccount, 'base64').toString('utf-8')
);

// Initialize the admin app if it's not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson),
    });
}

// Export the initialized admin auth instance
export const adminAuth = admin.auth();
