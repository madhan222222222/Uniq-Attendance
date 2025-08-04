
"use client"
import { StatsCard } from "@/components/dashboard/stats-card";
import { WeeklyReportCard } from "@/components/dashboard/weekly-report-card";
import { Users, BookUser, BookCopy, CalendarCheck, CalendarClock, UserPlus, Library } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    students: 0,
    staff: 0,
    batches: 0,
    attendance: "0%"
  });
  const [weeklyStats, setWeeklyStats] = useState({
    attendance: "0%",
    newStudents: 0,
    newBatches: 0,
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

        // Today's stats
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayAttendanceQuery = query(
            collection(dbInstance, "attendance"),
            where("date", ">=", Timestamp.fromDate(todayStart)),
            where("date", "<=", Timestamp.fromDate(todayEnd))
        );
        const todayAttendanceSnapshot = await getDocs(todayAttendanceQuery);

        let totalStudentsForToday = 0;
        let presentStudentsToday = 0;
        
        todayAttendanceSnapshot.forEach(doc => {
            const data = doc.data();
            const studentStatuses = Object.values(data.attendance);
            totalStudentsForToday += studentStatuses.length;
            presentStudentsToday += studentStatuses.filter(status => status === 'present').length;
        });
        
        const todayAttendancePercentage = totalStudentsForToday > 0 
            ? Math.round((presentStudentsToday / totalStudentsForToday) * 100)
            : 0;
        
        setStats({
          students: studentsSnapshot.size,
          staff: staffSnapshot.size,
          batches: batchesSnapshot.size,
          attendance: `${todayAttendancePercentage}%`
        });

        // Weekly stats
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        lastWeek.setHours(0, 0, 0, 0);

        // Weekly Attendance
        const weeklyAttendanceQuery = query(
            collection(dbInstance, "attendance"),
            where("date", ">=", Timestamp.fromDate(lastWeek))
        );
        const weeklyAttendanceSnapshot = await getDocs(weeklyAttendanceQuery);

        let totalStudentsForWeek = 0;
        let presentStudentsWeek = 0;
        weeklyAttendanceSnapshot.forEach(doc => {
            const data = doc.data();
            const studentStatuses = Object.values(data.attendance);
            totalStudentsForWeek += studentStatuses.length;
            presentStudentsWeek += studentStatuses.filter(status => status === 'present').length;
        });

        const weeklyAttendancePercentage = totalStudentsForWeek > 0
            ? Math.round((presentStudentsWeek / totalStudentsForWeek) * 100)
            : 0;

        // Weekly New Students & Batches (requires creation timestamp)
        const newStudentsQuery = query(collection(dbInstance, "students"), where("createdAt", ">=", Timestamp.fromDate(lastWeek)));
        const newBatchesQuery = query(collection(dbInstance, "batches"), where("createdAt", ">=", Timestamp.fromDate(lastWeek)));
        
        const newStudentsSnapshot = await getDocs(newStudentsQuery);
        const newBatchesSnapshot = await getDocs(newBatchesQuery);

        setWeeklyStats({
            attendance: `${weeklyAttendancePercentage}%`,
            newStudents: newStudentsSnapshot.size,
            newBatches: newBatchesSnapshot.size
        });

      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({ students: 0, staff: 0, batches: 0, attendance: "N/A" });
        setWeeklyStats({ attendance: "N/A", newStudents: 0, newBatches: 0 });
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
      
      <div className="mt-4">
         <h3 className="text-xl md:text-2xl font-bold tracking-tight font-headline">Weekly Report</h3>
         <p className="text-muted-foreground">Summary of the last 7 days.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        <WeeklyReportCard
          title="Weekly Attendance"
          value={isLoading ? "..." : weeklyStats.attendance}
          icon={CalendarClock}
          description="Average attendance rate this week"
        />
        <WeeklyReportCard
          title="New Students"
          value={isLoading ? "..." : weeklyStats.newStudents.toString()}
          icon={UserPlus}
          description="Students enrolled in the last 7 days"
        />
        <WeeklyReportCard
          title="New Batches"
          value={isLoading ? "..." : weeklyStats.newBatches.toString()}
          icon={Library}
          description="Batches created in the last 7 days"
        />
      </div>
    </div>
  );
}
