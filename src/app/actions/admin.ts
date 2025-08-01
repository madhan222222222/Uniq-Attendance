
"use server";

import * as admin from 'firebase-admin';

// This is a server-only file. It should not be imported into client components.

// This function initializes the admin app on-demand
function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccount) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for admin operations.');
    }

    const serviceAccountJson = JSON.parse(
        Buffer.from(serviceAccount, 'base64').toString('utf-8')
    );
    
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson),
    });
}


export async function changePassword(uid: string, newPassword: string): Promise<{success: boolean, message: string}> {
    try {
        const adminAuth = initializeAdminApp().auth();
        // This is a privileged operation and must be done from a secure backend environment
        await adminAuth.updateUser(uid, {
            password: newPassword,
        });
        return { success: true, message: 'Password updated successfully.' };
    } catch (error: any) {
        console.error("Password update failed:", error);
        return { success: false, message: error.message || 'An unknown error occurred while updating the password.' };
    }
}
