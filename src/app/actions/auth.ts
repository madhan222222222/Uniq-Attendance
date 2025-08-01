"use server";

import { staff, students } from "@/lib/data";

// This is a mock secret code for demonstration purposes.
// In a real application, this should be stored securely in environment variables.
const SUPER_ADMIN_CODE = "SECRET123";

export async function loginUser(payload: any) {
    console.log("Login attempt:", payload);
    const { email, password, role, adminCode } = payload;

    if (role === 'admin') {
        if (adminCode !== SUPER_ADMIN_CODE) {
            return { success: false, message: "Invalid Admin Code." };
        }
    }

    const user = staff.find(s => s.email === email);

    if (!user || user.password !== password) {
        return { success: false, message: "Invalid email or password." };
    }
    
    if (user.role !== role) {
        return { success: false, message: `You are not registered as a ${role}.` };
    }

    // In a real app, you would create a session/token here.
    return { success: true, message: "Login successful.", user };
}


export async function registerUser(payload: any) {
    console.log("New user registered:", payload);
    const { name, email, password, role, adminCode } = payload;

    if (role === 'admin') {
        if (adminCode !== SUPER_ADMIN_CODE) {
            return { success: false, message: "Invalid Admin Code. Cannot register an admin." };
        }
    }

    // Check if user already exists
    if (staff.some(s => s.email === email) || students.some(s => s.email === email)) {
        return { success: false, message: "A user with this email already exists." };
    }
    
    // In a real app, you would save this to a database with a hashed password.
    if (payload.role === 'staff' || payload.role === 'admin') {
        staff.push({
            id: `st${staff.length + 1}`,
            name,
            email,
            password,
            location: 'Default',
            role
        });
    }

    return { success: true, message: "User registered successfully." };
}
