
"use client";

import { Suspense } from "react";
import { RegisterStaffForm } from "@/components/auth/register-staff-form";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

function RegisterStaffContent() {
    const searchParams = useSearchParams();
    const role = searchParams.get("role");

    if (role !== 'admin') {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    You do not have permission to access this page. Please contact an administrator.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center">
             <div className="w-full max-w-md">
                <RegisterStaffForm />
            </div>
        </div>
    );
}

export default function RegisterStaffPage() {
    return (
         <Suspense fallback={
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <RegisterStaffContent />
        </Suspense>
    );
}
