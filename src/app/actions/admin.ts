
"use server";

import { initializeApp, getApps, cert, deleteApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// This function initializes and returns the Firebase Admin SDK Auth instance.
// It is called ONLY within the server action that needs it.
function getAdminAuthInstance() {
    const ADMIN_APP_NAME = 'firebase-admin-app-reset-password';
    // Check if the app is already initialized
    const alreadyCreated = getApps().some(app => app.name === ADMIN_APP_NAME);

    if (alreadyCreated) {
        return getAdminAuth(getApps().find(app => app.name === ADMIN_APP_NAME));
    }
    
    // If not initialized, create a new instance.
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for admin operations.');
    }
    const serviceAccount = JSON.parse(serviceAccountKey);

    const adminApp = initializeApp({
        credential: cert(serviceAccount),
    }, ADMIN_APP_NAME);

    return getAdminAuth(adminApp);
}


export async function resetPassword(payload: any) {
    const { email, password, adminCode } = payload;

    // Use a hardcoded secret code for password resets.
    if (adminCode !== '234567') {
        return { success: false, message: "Invalid Secret Code." };
    }

    try {
        const adminAuth = getAdminAuthInstance();
        const user = await adminAuth.getUserByEmail(email);
        await adminAuth.updateUser(user.uid, { password: password });
        
        // Clean up the admin app instance after use
        const adminApp = getApps().find(app => app.name === 'firebase-admin-app-reset-password');
        if (adminApp) {
            await deleteApp(adminApp);
        }

        return { success: true, message: "Password has been reset successfully. Please login with your new password." };
    } catch (error: any) {
        console.error("Password reset failed:", error);
         // Clean up the admin app instance in case of error
        const adminApp = getApps().find(app => app.name === 'firebase-admin-app-reset-password');
        if (adminApp) {
            await deleteApp(adminApp);
        }
        
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: "No user found with this email." };
        }
        return { success: false, message: error.message || "An unknown error occurred during password reset." };
    }
}
