
"use server";

import * as admin from 'firebase-admin';

// This is the secret code required to reset a password.
const RESET_PASSWORD_CODE = "234567";

async function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccount = {
        projectId: process.env.FB_PROJECT_ID,
        privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FB_CLIENT_EMAIL,
    };
    
    // The check for the service account is now inside the function.
    // This ensures it only runs when the function is called, not during build time.
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        throw new Error("Firebase service account credentials are not set in environment variables. This is required for admin operations.");
    }

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
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

        // More robust error handling
        if (error && error.code === 'auth/user-not-found') {
            return { success: false, message: "No user found with this email address." };
        }
        
        // Return a generic error message for other failures, checking if error and error.message exist
        const message = error?.message || "An unknown error occurred during password reset.";
        return { success: false, message };
    }
}
