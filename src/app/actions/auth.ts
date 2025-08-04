
"use server";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, arrayUnion } from "firebase/firestore";

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
    const { name, email, password, role, location, phone } = payload;
    
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
                phone: phone || '',
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

export async function addStudent(payload: { name: string; email: string; phone: string; location: string; batchId: string; }) {
    try {
        // 1. Add student to "students" collection
        const studentDocRef = await addDoc(collection(db, "students"), {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            location: payload.location,
            batchIds: [payload.batchId] // Start with the selected batch
        });
        const studentId = studentDocRef.id;

        // 2. Update the batch's studentIds array
        const batchDocRef = doc(db, "batches", payload.batchId);
        await updateDoc(batchDocRef, {
            studentIds: arrayUnion(studentId)
        });

        return { success: true, message: `Student ${payload.name} added successfully.` };

    } catch (error: any) {
        console.error("Error adding student: ", error);
        return { success: false, message: error.message || "An unknown error occurred." };
    }
}

export async function addBatch(payload: { name: string; location: string; timings: string }) {
    try {
        await addDoc(collection(db, "batches"), {
            ...payload,
            studentIds: [] // Initialize with empty array
        });
        return { success: true, message: `Batch ${payload.name} added successfully.` };
    } catch (error: any) {
        console.error("Error adding batch: ", error);
        return { success: false, message: error.message || "An unknown error occurred." };
    }
}

export async function resetPassword(email: string) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Password reset email sent successfully. Please check your inbox." };
    } catch (error: any) {
        console.error("Error sending password reset email:", error);
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: "No user found with this email." };
        }
        return { success: false, message: error.message || "An unknown error occurred." };
    }
}
