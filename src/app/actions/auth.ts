
"use server";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";

const SUPER_ADMIN_CODE_DOC_ID = "super_admin_code";
const SECRETS_COLLECTION = "secrets";

async function getSuperAdminCode(): Promise<string | null> {
    try {
        const docRef = doc(db, SECRETS_COLLECTION, SUPER_ADMIN_CODE_DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().code;
        } else {
            // If the admin code doesn't exist, let's create one for the first time.
            // In a real-world scenario, this should be seeded manually or through a secure setup process.
            const newCode = "SECRET123";
            await setDoc(docRef, { code: newCode });
            return newCode;
        }
    } catch (error) {
        console.error("Error getting super admin code:", error);
        return null;
    }
}

export async function loginUser(payload: any) {
    console.log("Login attempt:", payload);
    const { email, password, role, adminCode } = payload;

    try {
        if (role === 'admin') {
            const superAdminCode = await getSuperAdminCode();
            if (adminCode !== superAdminCode) {
                return { success: false, message: "Invalid Admin Code." };
            }
        }

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
        return { success: false, message: error.message || "Invalid email or password." };
    }
}


export async function registerUser(payload: any) {
    console.log("New user registered:", payload);
    const { name, email, password, role, adminCode, location } = payload;

    try {
        if (role === 'admin') {
            const superAdminCode = await getSuperAdminCode();
            if (adminCode !== superAdminCode) {
                return { success: false, message: "Invalid Admin Code. Cannot register an admin." };
            }
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name,
            email,
            role,
            location: location || "Default", // Staff should have a location
        });
        
        // Also add to staff/student collection based on role
        if (role === 'admin' || role === 'staff') {
            await setDoc(doc(db, "staff", user.uid), {
                id: user.uid,
                name,
                email,
                role,
                location: location || "Default",
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
