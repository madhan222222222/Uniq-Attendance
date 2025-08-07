
"use server";

import admin from 'firebase-admin';

// This is the secret code required to reset a password.
const RESET_PASSWORD_CODE = "234567";

// Prepare the service account credentials from environment variables.
const serviceAccount = {
    projectId: process.env.FB_PROJECT_ID,
    privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FB_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK only if it hasn't been already.
// This approach ensures it's a singleton and avoids re-initialization errors.
if (!admin.apps.length) {
    // Check for the existence of credentials before initializing.
    if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } catch (error) {
            console.error("Firebase Admin SDK initialization error:", error);
        }
    } else {
        console.warn("Firebase Admin credentials are not set. Some features will be disabled.");
    }
}


export async function resetPasswordWithAdminCode(payload: any) {
    // Check if the SDK is configured before proceeding.
    if (!admin.apps.length) {
         return { success: false, message: "Firebase Admin SDK is not configured. Cannot reset password. Please check server environment variables." };
    }
    
    try {
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

        // Handle specific Firebase auth errors
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: "No user found with this email address." };
        }
        
        // Handle other errors
        const errorMessage = error.message || "An unknown error occurred during password reset.";
        return { success: false, message: errorMessage };
    }
}
