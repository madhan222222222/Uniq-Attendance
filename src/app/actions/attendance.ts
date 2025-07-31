"use server";

import { absentReasonCode, AbsentReasonCodeInput } from "@/ai/flows/absent-reason-code";
import { students, batches, locations } from "@/lib/data";

export async function getAbsenceReasonSuggestion(input: AbsentReasonCodeInput) {
    try {
        const result = await absentReasonCode(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI reason code generation failed:", error);
        return { success: false, error: "Failed to generate AI suggestion." };
    }
}

export async function submitAttendance(payload: any) {
    console.log("Attendance submitted:", payload);
    // In a real app, you would save this to a database.
    return { success: true, message: "Attendance submitted successfully." };
}

export type ReportData = { student: string; batch: string; date: string; status: 'Present' | 'Absent'; topic: string };

export async function getReportData(filters: { location?: string, from?: Date, to?: Date }): Promise<{ success: true, data: ReportData[] } | { success: false, error: string }> {
  // In a real app, you would fetch this from a database based on filters.
  // For this demo, we'll return some mock data and apply basic filtering.
  const mockReportData: ReportData[] = [
    { student: 'Aarav Kumar', batch: 'Morning Physics', date: '2024-07-28', status: 'Present', topic: 'Kinematics' },
    { student: 'Priya Singh', batch: 'Morning Physics', date: '2024-07-28', status: 'Absent', topic: 'Kinematics' },
    { student: 'Diya Sharma', batch: 'Evening Maths', date: '2024-07-27', status: 'Present', topic: 'Calculus' },
    { student: 'Rohan Patel', batch: 'Weekend Chemistry', date: '2024-07-26', status: 'Present', topic: 'Organic Chemistry' },
  ];

  const studentLocations: Record<string, string> = {};
  students.forEach(s => studentLocations[s.name] = s.location);

  const batchLocations: Record<string, string> = {};
  batches.forEach(b => batchLocations[b.name] = b.location);

  let filteredData = mockReportData;

  if (filters.location) {
      const lowerCaseLocation = filters.location.toLowerCase();
      const locationMatch = locations.find(l => l.toLowerCase() === lowerCaseLocation);
      if(locationMatch) {
        filteredData = filteredData.filter(d => (batchLocations[d.batch] === locationMatch));
      }
  }

  if (filters.from && filters.to) {
    filteredData = filteredData.filter(d => {
        const recordDate = new Date(d.date);
        return recordDate >= filters.from! && recordDate <= filters.to!;
    })
  }

  return { success: true, data: filteredData };
}