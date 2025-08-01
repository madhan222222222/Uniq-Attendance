
"use client";

import { RegisterAdminForm } from "@/components/auth/register-admin-form";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
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
          <p>Loading...</p>
        ) : !adminExists ? (
           <RegisterAdminForm />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>An admin account already exists.</p>
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/login">
                Proceed to Login
              </Link>
            </Button>
          </div>
        )}
        {!loading && adminExists && (
           <div className="mt-4 text-center text-sm">
             Already have an account?{' '}
             <Button variant="link" asChild className="p-0 h-auto">
               <Link href="/login">
                 Login
               </Link>
             </Button>
           </div>
        )}
         {!loading && !adminExists && (
           <div className="mt-4 text-center text-sm">
             Already have an account?{' '}
             <Button variant="link" asChild className="p-0 h-auto">
               <Link href="/login">
                 Login
               </Link>
             </Button>
           </div>
        )}
      </div>
    </main>
  );
}
