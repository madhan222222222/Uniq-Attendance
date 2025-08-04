
"use client"
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, BookUser, BookCopy, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    students: 0,
    staff: 0,
    batches: 0,
    attendance: "0"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      const dbInstance = db;
      try {
        const studentsSnapshot = await getDocs(collection(dbInstance, "students"));
        const staffSnapshot = await getDocs(collection(dbInstance, "staff"));
        const batchesSnapshot = await getDocs(collection(dbInstance, "batches"));

        // Fetch today's attendance
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const attendanceQuery = query(
            collection(dbInstance, "attendance"),
            where("date", ">=", Timestamp.fromDate(todayStart)),
            where("date", "<=", Timestamp.fromDate(todayEnd))
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);

        let totalStudentsForAttendance = 0;
        let presentStudents = 0;
        
        attendanceSnapshot.forEach(doc => {
            const data = doc.data();
            const studentStatuses = Object.values(data.attendance);
            totalStudentsForAttendance += studentStatuses.length;
            presentStudents += studentStatuses.filter(status => status === 'present').length;
        });
        
        const attendancePercentage = totalStudentsForAttendance > 0 
            ? Math.round((presentStudents / totalStudentsForAttendance) * 100)
            : 0;

        setStats({
          students: studentsSnapshot.size,
          staff: staffSnapshot.size,
          batches: batchesSnapshot.size,
          attendance: `${attendancePercentage}%`
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Set default error state or handle appropriately
        setStats({ students: 0, staff: 0, batches: 0, attendance: "N/A" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Welcome Back!</h2>
        <p className="text-muted-foreground">Here's a summary of your institution. Today is {today}.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={isLoading ? "..." : stats.students.toString()}
          icon={Users}
          description="Across all locations"
        />
        <StatsCard
          title="Total Staff"
          value={isLoading ? "..." : stats.staff.toString()}
          icon={BookUser}
          description="Active teaching and admin staff"
        />
        <StatsCard
          title="Total Batches"
          value={isLoading ? "..." : stats.batches.toString()}
          icon={BookCopy}
          description="Scheduled across all locations"
        />
        <StatsCard
          title="Attendance Today"
          value={isLoading ? "..." : stats.attendance}
          icon={CalendarCheck}
          description="Overall attendance rate for today"
        />
      </div>
    </div>
  );
}
