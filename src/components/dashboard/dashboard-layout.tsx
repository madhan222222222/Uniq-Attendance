"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "staff"; // Default to staff

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
             </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-headline text-xl font-semibold text-sidebar-foreground">
                Attendance AI
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav role={role as "admin" | "staff"} />
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="profile picture" />
              <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sm text-sidebar-foreground capitalize">{role}</span>
              <span className="text-xs text-muted-foreground">
                {role}@example.com
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto group-data-[collapsible=icon]:hidden text-sidebar-foreground hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="font-headline text-lg font-semibold md:text-xl capitalize">
                {role}'s Dashboard
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
