
"use client"
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, BookUser, BookCopy, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ChangePasswordCard } from "./change-password-card";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    students: 0,
    staff: 0,
    batches: 0,
    attendance: "N/A"
  });

  useEffect(() => {
    async function fetchStats() {
      const dbInstance = db;
      const studentsSnapshot = await getDocs(collection(dbInstance, "students"));
      const staffSnapshot = await getDocs(collection(dbInstance, "staff"));
      const batchesSnapshot = await getDocs(collection(dbInstance, "batches"));
      // A more complex query would be needed for today's attendance percentage.
      // For now, we'll keep it simple.

      setStats({
        students: studentsSnapshot.size,
        staff: staffSnapshot.size,
        batches: batchesSnapshot.size,
        attendance: "95%" // Mocked for now
      })
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
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome Back!</h2>
        <p className="text-muted-foreground">Here's a summary of your institution. Today is {today}.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats.students.toString()}
          icon={Users}
          description="Across all locations"
        />
        <StatsCard
          title="Total Staff"
          value={stats.staff.toString()}
          icon={BookUser}
          description="Active teaching and admin staff"
        />
        <StatsCard
          title="Total Batches"
          value={stats.batches.toString()}
          icon={BookCopy}
          description="Scheduled across all locations"
        />
        <StatsCard
          title="Attendance Today"
          value={stats.attendance}
          icon={CalendarCheck}
          description="Overall attendance rate for today"
        />
      </div>
      <div>
        <ChangePasswordCard />
      </div>
    </div>
  );
}
