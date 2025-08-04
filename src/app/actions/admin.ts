
"use server";

import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
    if (!serviceAccount) {
        throw new Error("Firebase service account key is not set in environment variables.");
    }
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
}


export async function resetPasswordWithAdminCode(payload: any) {
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
