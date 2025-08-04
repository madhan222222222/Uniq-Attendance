
"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex items-center gap-2 sm:gap-4 text-primary">
          <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold">Uniq attendance</h1>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground">
          Smart attendance tracking for modern institutions.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
            Powered By Python Team
        </p>
      </div>
      <div className="w-full max-w-xs sm:max-w-sm pt-8 text-center">
         <div className="flex flex-col space-y-4">
            <Button asChild size="lg">
              <Link href="/login">
                Login
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">
                Register
              </Link>
            </Button>
          </div>
      </div>
    </main>
  );
}
