
import * as admin from 'firebase-admin';

// This is a server-only file. It should not be imported into client components.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for admin operations.');
}

const serviceAccountJson = JSON.parse(
  Buffer.from(serviceAccount, 'base64').toString('ascii')
);

const appName = 'firebase-admin-app-in-app-reset';

export function getAdminApp() {
    // Check if the app is already initialized
    const existingApp = admin.apps.find(app => app?.name === appName);
    if (existingApp) {
        return existingApp;
    }

    // Initialize the admin app
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson),
    }, appName);
}
