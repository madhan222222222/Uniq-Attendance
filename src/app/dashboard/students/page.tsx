"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Student, Batch } from "@/lib/data";
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
import { AddStudentDialog } from "@/components/students/add-student-dialog";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function fetchStudentsAndBatches() {
    setIsLoading(true);
    const studentsQuerySnapshot = await getDocs(collection(db, "students"));
    const studentsData = studentsQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
    setStudents(studentsData);

    const batchesQuerySnapshot = await getDocs(collection(db, "batches"));
    const batchesData = batchesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Batch[];
    setBatches(batchesData);

    setIsLoading(false);
  }

  useEffect(() => {
    fetchStudentsAndBatches();
  }, []);

  const handleStudentAdded = () => {
    fetchStudentsAndBatches(); // Refetch data
    setIsDialogOpen(false); // Close dialog
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Students</CardTitle>
          <CardDescription>Manage student profiles and information.</CardDescription>
        </div>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                   <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
