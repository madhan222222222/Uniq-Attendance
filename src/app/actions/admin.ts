
"use server";

import * as admin from 'firebase-admin';

// This function will initialize the admin app only when called.
function initializeAdminApp() {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    // Check if the app is already initialized to avoid errors.
    if (!admin.apps.length) {
        if (!serviceAccount) {
            // This error will only be thrown if the function is called without the key being set,
            // not during the build.
            throw new Error("Firebase service account key is not set in environment variables.");
        }
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
        });
    }
}

export async function resetPasswordWithAdminCode(payload: any) {
    // Initialize the app right when it's needed.
    initializeAdminApp();
    
    const { email, newPassword, adminCode } = payload;
    const SECRET_CODE = "234567"; // Your secret code

    if (adminCode !== SECRET_CODE) {
        return { success: false, message: "Invalid secret code." };
    }

    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(user.uid, {
            password: newPassword,
        });
        return { success: true, message: "Password has been reset successfully." };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: "No user found with this email." };
        }
        console.error("Error resetting password:", error);
        return { success: false, message: error.message || "An unknown error occurred." };
    }
}
