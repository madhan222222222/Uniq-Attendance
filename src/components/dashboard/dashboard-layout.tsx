
"use client";

import React, { useEffect, useState } from "react";
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
import { GraduationCap, LogOut, User as UserIcon, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "staff"; // Default to staff
  const [user, setUser] = useState<{name: string, email: string, role: string} | null>(null);

  useEffect(() => {
      const userData = sessionStorage.getItem('user');
      if (userData) {
          setUser(JSON.parse(userData));
      } else {
          // If no user data, redirect to login
          router.push('/login');
      }
  }, [router]);


  const handleLogout = async () => {
    try {
        await signOut(auth);
        sessionStorage.removeItem('user');
        router.push('/login');
    } catch (error) {
        console.error("Logout failed:", error);
    }
  };

  if (!user) {
      return (
          <div className="flex h-screen items-center justify-center">
              <p>Loading...</p>
          </div>
      )
  }

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
                Uniq attendance
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav role={role as "admin" | "staff"} />
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                    <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="profile picture" />
                    <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sm text-sidebar-foreground capitalize">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                        {user.email}
                    </span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mb-2 ml-4" side="top" align="start">
                <DropdownMenuLabel>
                    <div className="font-bold">Uniq employee</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="font-medium capitalize">{user.name}</span>
                </DropdownMenuItem>
                 <DropdownMenuItem className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">{user.email}</span>
                </DropdownMenuItem>
                 <DropdownMenuItem className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium capitalize">{user.role}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
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
