"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function RegisterPage() {
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
                <RegisterForm />
            </div>
        </div>
    );
}
