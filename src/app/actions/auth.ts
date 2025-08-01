
"use server";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';


// This function should only be initialized on the server
function getAdminApp() {
    if (getApps().length > 0 && getApps().some(app => app.name === 'admin')) {
        return getAdminAuth(getApps().find(app => app.name === 'admin'));
    }

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for admin operations.');
    }
    const serviceAccount = JSON.parse(serviceAccountKey);

    initializeApp({
        credential: cert(serviceAccount),
    }, 'admin');

    return getAdminAuth();
}


export async function resetPassword(payload: any) {
    const { email, password, adminCode } = payload;

    // Use a hardcoded secret code for password resets. In a real app, this should be more secure.
    if (adminCode !== 'SECRET123') {
        return { success: false, message: "Invalid Secret Code." };
    }

    try {
        const adminAuth = getAdminApp();
        const user = await adminAuth.getUserByEmail(email);
        await adminAuth.updateUser(user.uid, { password: password });
        return { success: true, message: "Password has been reset successfully. Please login with your new password." };
    } catch (error: any) {
        console.error("Password reset failed:", error);
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: "No user found with this email." };
        }
        return { success: false, message: error.message || "An unknown error occurred during password reset." };
    }
}


export async function loginUser(payload: any) {
    console.log("Login attempt:", payload);
    const { email, password, role } = payload;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists() || userDoc.data().role !== role) {
             return { success: false, message: `You are not registered as a ${role}.` };
        }

        return { success: true, message: "Login successful.", user: { uid: user.uid, email: user.email, name: userDoc.data().name, ...userDoc.data() } };
    } catch (error: any) {
        console.error("Login failed:", error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            return { success: false, message: "Invalid email or password. Please check your credentials or register." };
        }
        return { success: false, message: error.message || "An unknown error occurred during login." };
    }
}


export async function registerUser(payload: any) {
    console.log("New user registered:", payload);
    const { name, email, password, role, location } = payload;

    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user details in Firestore 'users' collection for all roles
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name,
            email,
            role,
            location: role === 'admin' ? 'All' : location, 
        });
        
        // Also add to 'staff' collection if the role is 'staff'
        if (role === 'staff') {
            await setDoc(doc(db, "staff", user.uid), {
                id: user.uid, 
                name,
                email,
                role,
                location: location,
                phone: payload.phone || '',
            });
        }

        return { success: true, message: "User registered successfully." };

    } catch (error: any) {
        console.error("Registration failed:", error);
        // Check for specific errors
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: "An account with this email address already exists." };
        }
        return { success: false, message: error.message || "An unknown error occurred during registration." };
    }
}

