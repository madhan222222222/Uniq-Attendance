
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookUser,
  BookCopy,
  CalendarCheck,
  LineChart,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";


type SidebarNavProps = {
  role: "admin" | "staff";
};

function NavItems({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();
  const roleQuery = searchParamsHook.get('role');
  const searchParams = `?role=${roleQuery}`;

  const adminNavItems = [
    { href: `/dashboard${searchParams}`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/dashboard/attendance${searchParams}`, label: "Attendance", icon: CalendarCheck },
    { href: `/dashboard/students${searchParams}`, label: "Students", icon: Users },
    { href: `/dashboard/staff${searchParams}`, label: "Staff", icon: BookUser },
    { href: `/dashboard/batches${searchParams}`, label: "Batches", icon: BookCopy },
    { href: `/dashboard/reporting${searchParams}`, label: "Reporting", icon: LineChart },
  ];

  const staffNavItems = [
    { href: `/dashboard${searchParams}`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/dashboard/attendance${searchParams}`, label: "Attendance", icon: CalendarCheck },
    { href: `/dashboard/students${searchParams}`, label: "Students", icon: Users },
    { href: `/dashboard/batches${searchParams}`, label: "Batches", icon: BookCopy },
    { href: `/dashboard/reporting${searchParams}`, label: "Reporting", icon: LineChart },
  ];

  const navItems = role === "admin" ? adminNavItems : staffNavItems;

  return (
     <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href.split('?')[0]}
            tooltip={{ children: item.label }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

function SidebarNavMenuSkeleton() {
  return (
    <SidebarMenu>
      {[...Array(5)].map((_, i) => (
        <SidebarMenuItem key={i}>
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function SidebarNav({ role }: SidebarNavProps) {
  return (
    <Suspense fallback={<SidebarNavMenuSkeleton />}>
      <NavItems role={role} />
    </Suspense>
  );
}
