
"use server";

import * as admin from 'firebase-admin';

// This is the secret code required to reset a password.
const RESET_PASSWORD_CODE = "234567";

// Helper function to initialize the Firebase Admin App if it hasn't been already.
// This prevents re-initialization errors.
function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccount = {
        projectId: process.env.FB_PROJECT_ID,
        privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FB_CLIENT_EMAIL,
    };

    // This check is critical and must run before attempting to initialize.
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        // We throw a clear error that will be caught by our handler.
        throw new Error("FIREBASE_ADMIN_SDK_CONFIG_MISSING");
    }

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export async function resetPasswordWithAdminCode(payload: any) {
    try {
        initializeAdminApp(); // Ensure the app is initialized.

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

        // Simplified and more robust error handling
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: "No user found with this email address." };
        }
        if (error.message === 'FIREBASE_ADMIN_SDK_CONFIG_MISSING') {
            return { success: false, message: "Firebase Admin SDK is not configured. Cannot reset password." };
        }
        
        return { success: false, message: "An unknown error occurred during password reset." };
    }
}
