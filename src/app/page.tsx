
"use client";

import { RegisterAdminForm } from "@/components/auth/register-admin-form";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { hasAdminUser } from "@/app/actions/auth";

export default function Home() {
  const [adminExists, setAdminExists] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const exists = await hasAdminUser();
      setAdminExists(exists);
      setLoading(false);
    }
    checkAdmin();
  }, []);

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
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading...</p>
          </div>
        ) : !adminExists ? (
           <RegisterAdminForm />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>An admin account already exists.</p>
            <p>Please proceed to the login page.</p>
            <Button asChild className="mt-4">
              <Link href="/login">
                Go to Login
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
