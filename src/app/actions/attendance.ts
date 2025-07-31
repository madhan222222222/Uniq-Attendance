"use server";

import { absentReasonCode, AbsentReasonCodeInput } from "@/ai/flows/absent-reason-code";

export async function getAbsenceReasonSuggestion(input: AbsentReasonCodeInput) {
    try {
        const result = await absentReasonCode(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI reason code generation failed:", error);
        return { success: false, error: "Failed to generate AI suggestion." };
    }
}
