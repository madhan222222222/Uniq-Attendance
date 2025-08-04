
"use server";

import * as admin from 'firebase-admin';

// This is the secret code required to reset a password.
const RESET_PASSWORD_CODE = "234567";

async function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccount) {
        // This error will now only be thrown if the function is actually called
        // without the environment variable being set, not during build time.
        throw new Error("Firebase service account key is not set in environment variables.");
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
