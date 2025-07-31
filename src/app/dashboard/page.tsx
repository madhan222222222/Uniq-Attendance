import { StatsCard } from "@/components/dashboard/stats-card";
import { students, staff, batches } from "@/lib/data";
import { Users, BookUser, BookCopy, CalendarCheck } from "lucide-react";

export default function DashboardPage() {
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
          value={students.length.toString()}
          icon={Users}
          description="Across all locations"
        />
        <StatsCard
          title="Total Staff"
          value={staff.length.toString()}
          icon={BookUser}
          description="Active teaching and admin staff"
        />
        <StatsCard
          title="Total Batches"
          value={batches.length.toString()}
          icon={BookCopy}
          description="Scheduled across all locations"
        />
        <StatsCard
          title="Attendance Today"
          value="95%"
          icon={CalendarCheck}
          description="Overall attendance rate for today"
        />
      </div>
      <div>
          <h3 className="text-2xl font-bold tracking-tight font-headline mb-4">Quick Actions</h3>
          {/* Quick actions would go here */}
          <p className="text-muted-foreground">This section would contain quick links for common tasks.</p>
      </div>
    </div>
  );
}
