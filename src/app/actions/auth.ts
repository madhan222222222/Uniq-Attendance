
"use server";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

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

        const userData = userDoc.data();
        // Convert timestamp to a serializable format (ISO string)
        const serializableUser = {
            ...userData,
            createdAt: userData.createdAt.toDate().toISOString(),
        };

        return { success: true, message: "Login successful.", user: serializableUser };
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
            createdAt: Timestamp.now(), 
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
                createdAt: Timestamp.now(),
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
            batchIds: [payload.batchId], // Start with the selected batch
            createdAt: Timestamp.now(),
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
            studentIds: [], // Initialize with empty array
            createdAt: Timestamp.now(),
        });
        return { success: true, message: `Batch ${payload.name} added successfully.` };
    } catch (error: any) {
        console.error("Error adding batch: ", error);
        return { success: false, message: error.message || "An unknown error occurred." };
    }
}

export async function addStaff(payload: { name: string; email: string; phone: string; location: string; }) {
    try {
        // For staff, we might want to invite them or set a temporary password,
        // but for now, we'll just add them to the staff collection.
        // The admin would then need to register them via the "Register New Staff" page
        // to create their login credentials. This action just adds their profile.
        const staffDocRef = await addDoc(collection(db, "staff"), {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            location: payload.location,
            role: 'staff',
            createdAt: Timestamp.now(),
        });
        return { success: true, message: `Staff ${payload.name} added successfully. Register them to create login credentials.` };
    } catch (error: any) {
        console.error("Error adding staff: ", error);
        return { success: false, message: error.message || "An unknown error occurred." };
    }
}
