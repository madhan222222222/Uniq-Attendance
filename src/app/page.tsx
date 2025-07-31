import { LoginForm } from "@/components/auth/login-form";
import { GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center gap-4 text-primary">
          <GraduationCap className="h-12 w-12" />
          <h1 className="font-headline text-5xl font-bold">Attendance AI</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Smart attendance tracking for modern institutions.
        </p>
      </div>
      <div className="w-full max-w-sm pt-8">
        <LoginForm />
      </div>
    </main>
  );
}
