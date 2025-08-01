
"use client";

import { usePathname } from "next/navigation";
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
import { useSearchParams } from "next/navigation";

type SidebarNavProps = {
  role: "admin" | "staff";
};

export function SidebarNav({ role }: SidebarNavProps) {
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
  );
}
