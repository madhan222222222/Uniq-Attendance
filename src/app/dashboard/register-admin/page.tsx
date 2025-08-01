
"use client";

import { RegisterAdminForm } from "@/components/auth/register-admin-form";

export default function RegisterAdminPage() {
    return (
        <div className="flex flex-col items-center justify-center">
             <div className="w-full max-w-md">
                <RegisterAdminForm />
            </div>
        </div>
    );
}
