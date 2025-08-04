
"use server";

import * as admin from 'firebase-admin';

// This is the secret code required to reset a password.
const RESET_PASSWORD_CODE = "234567";

async function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    // The check for the service account is now inside the function.
    // This ensures it only runs when the function is called, not during build time.
    if (!serviceAccount) {
        throw new Error("Firebase service account key is not set in environment variables. This is required for admin operations.");
    }

    return admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
}

export async function resetPasswordWithAdminCode(payload: any) {
    try {
        await initializeAdminApp();

        const { email, newPassword, code } = payload;

        if (code !== RESET_PASSWORD_CODE) {
            return { success: false, message: "Invalid secret code." };
        }

        // Get the user by email
        const userRecord = await admin.auth().getUserByEmail(email);

        // Update the user's password
        await admin.auth().updateUser(userRecord.uid, {
            password: newPassword,
        });

        return { success: true, message: "Password has been reset successfully." };
    } catch (error: any) {
        console.error("Password reset failed:", error);

        if (error.code === 'auth/user-not-found') {
            return { success: false, message: "No user found with this email address." };
        }
        
        // Return a generic error message for other failures
        return { success: false, message: error.message || "An unknown error occurred during password reset." };
    }
}
