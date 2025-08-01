
"use client";

import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { hasAdminUser } from '../actions/auth';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const exists = await hasAdminUser();
      // We only show the register link if no admin exists yet.
      // Admins are created from the dashboard after the first one is made.
      setShowRegister(!exists);
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
        <LoginForm />
        <div className="mt-4 text-center text-sm">
            {loading ? (
                <div className="flex justify-center items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            ) : showRegister ? (
              <>
                Don't have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/">
                    Register as Initial Admin
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground">New user? Please contact an administrator to get an account.</p>
            )}
        </div>
      </div>
    </main>
  );
}
