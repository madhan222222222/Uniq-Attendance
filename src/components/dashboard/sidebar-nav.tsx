
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
  User,
  Presentation,
  UserPlus,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type SidebarNavProps = {
  role: "admin" | "staff";
};

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParams = `?role=${role}`;

  const adminNavItems = [
    { href: `/dashboard${searchParams}`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/dashboard/students${searchParams}`, label: "Students", icon: Users },
    { href: `/dashboard/staff${searchParams}`, label: "Staff", icon: BookUser },
    { href: `/dashboard/batches${searchParams}`, label: "Batches", icon: BookCopy },
    { href: `/dashboard/attendance${searchParams}`, label: "Attendance", icon: CalendarCheck },
    { href: `/dashboard/reporting${searchParams}`, label: "Reporting", icon: LineChart },
    { href: `/dashboard/register-admin${searchParams}`, label: "Register Admin", icon: UserPlus },
    { href: `/dashboard/register-staff${searchParams}`, label: "Register Staff", icon: UserPlus },
  ];

  const staffNavItems = [
    { href: `/dashboard${searchParams}`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/dashboard/students${searchParams}`, label: "Students", icon: User },
    { href: `/dashboard/attendance${searchParams}`, label: "Attendance", icon: Presentation },
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
