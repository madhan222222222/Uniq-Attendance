
"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center gap-4 text-primary">
          <GraduationCap className="h-12 w-12" />
          <h1 className="font-headline text-5xl font-bold">Uniq attendance</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Smart attendance tracking for modern institutions.
        </p>
        <p className="text-sm text-muted-foreground">
            powered by python team
        </p>
      </div>
      <div className="w-full max-w-sm pt-8 text-center">
         <div className="flex flex-col space-y-4">
            <Button asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">
                Register
              </Link>
            </Button>
          </div>
      </div>
    </main>
  );
}
