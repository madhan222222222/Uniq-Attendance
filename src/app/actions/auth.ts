"use server";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";

// This is a temporary solution for the admin code.
// In a production environment, this should be a secure environment variable.
const SUPER_ADMIN_CODE = "SECRET123";


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
    const { name, email, password, role, adminCode, location } = payload;

    try {
        if (role === 'admin') {
            if (adminCode !== SUPER_ADMIN_CODE) {
                return { success: false, message: "Invalid Admin Code. Cannot register an admin." };
            }
        }

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
            });
        }

        return { success: true, message: "User registered successfully." };

    } catch (error: any) {
        console.error("Registration failed:", error);
        // Check for specific errors
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: "A user with this email already exists." };
        }
        return { success: false, message: error.message || "An unknown error occurred." };
    }
}

export async function hasAdminUser() {
    try {
        const q = query(collection(db, "users"), where("role", "==", "admin"), limit(1));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking for admin user:", error);
        // In case of error, assume an admin exists to be safe
        return true;
    }
}