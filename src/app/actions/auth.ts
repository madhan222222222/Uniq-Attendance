"use server";

import { staff, students } from "@/lib/data";

export async function registerUser(payload: any) {
    console.log("New user registered:", payload);
    // In a real app, you would save this to a database.
    // For this demo, we'll just log it.
    // You might also want to differentiate between staff and student registration.
    if (payload.role === 'staff' || payload.role === 'admin') {
        staff.push({
            id: `st${staff.length + 1}`,
            name: payload.name,
            email: payload.email,
            location: 'Default' // Or get from payload
        });
    }

    return { success: true, message: "User registered successfully." };
}
