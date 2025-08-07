
"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Staff } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { AddStaffDialog } from "@/components/staff/add-staff-dialog";
import { useSearchParams, useRouter } from "next/navigation";

function StaffContent() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role");

  async function fetchStaff() {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(db, "staff"));
    const staffData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Staff[];
    setStaff(staffData);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleStaffAdded = () => {
    fetchStaff();
    setIsDialogOpen(false);
  }
  
  const handleRegisterRedirect = () => {
    router.push(`/dashboard/register-staff?role=admin`);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Staff</CardTitle>
          <CardDescription>Manage staff profiles and permissions.</CardDescription>
        </div>
         {role === 'admin' && (
          <Button onClick={handleRegisterRedirect}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Register New Staff
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.location}</TableCell>
                <TableCell className="capitalize">{s.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}


export default function StaffPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}>
      <StaffContent />
    </Suspense>
  )
}
