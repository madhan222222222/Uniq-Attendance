"use server";

import { absentReasonCode, AbsentReasonCodeInput } from "@/ai/flows/absent-reason-code";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { students, batches, locations } from "@/lib/data"; // Keep for UI elements that might still need it temporarily

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
    try {
        const attendanceDate = new Date(payload.date);
        const docRef = await addDoc(collection(db, "attendance"), {
            ...payload,
            date: Timestamp.fromDate(attendanceDate), // Store as Firestore Timestamp
        });
        console.log("Attendance submitted with ID: ", docRef.id);
        return { success: true, message: "Attendance submitted successfully." };
    } catch (error) {
        console.error("Error submitting attendance: ", error);
        return { success: false, message: "Failed to submit attendance." };
    }
}

export type ReportData = { 
    student: string; 
    batch: string; 
    date: string; 
    status: 'Present' | 'Absent'; 
    topic: string,
    batchLocation: string;
};

export async function getReportData(filters: { location?: string, from?: Date, to?: Date }): Promise<{ success: true, data: ReportData[] } | { success: false, error: string }> {
  try {
    let q = query(collection(db, "attendance"));

    if (filters.from) {
        q = query(q, where("date", ">=", Timestamp.fromDate(filters.from)));
    }
    if (filters.to) {
        // Add 1 day to 'to' date to make it inclusive
        const toDate = new Date(filters.to);
        toDate.setDate(toDate.getDate() + 1);
        q = query(q, where("date", "<", Timestamp.fromDate(toDate)));
    }
    
    const querySnapshot = await getDocs(q);
    const reportData: ReportData[] = [];

    const studentDocs = await getDocs(collection(db, "students"));
    const studentMap = new Map(studentDocs.docs.map(d => [d.id, d.data()]));

    const batchDocs = await getDocs(collection(db, "batches"));
    const batchMap = new Map(batchDocs.docs.map(d => [d.id, d.data()]));

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const batchInfo = batchMap.get(data.batchId);
      
      if(filters.location && filters.location !== 'all' && batchInfo?.location.toLowerCase() !== filters.location.toLowerCase()) {
        return; // Skip if location filter doesn't match
      }

      Object.entries(data.attendance).forEach(([studentId, status]) => {
          const studentInfo = studentMap.get(studentId);
          if (studentInfo && batchInfo) {
              reportData.push({
                  student: studentInfo.name,
                  batch: batchInfo.name,
                  date: (data.date.toDate() as Date).toLocaleDateString(),
                  status: status === 'present' ? 'Present' : 'Absent',
                  topic: data.todayTopic,
                  batchLocation: batchInfo.location,
              });
          }
      })
    });
    
    return { success: true, data: reportData };
  } catch (error) {
    console.error("Error fetching report data: ", error);
    return { success: false, error: "Failed to fetch report data." };
  }
}