"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { students, batches, Batch, Student } from "@/lib/data";
import { AiReasonDialog } from "./ai-reason-dialog";
import { useToast } from "@/hooks/use-toast";

type AttendanceStatus = "present" | "absent" | "unset";
type AttendanceRecord = Record<string, AttendanceStatus>;

export function AttendanceTracker() {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [batchStudents, setBatchStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    const selectedBatch = batches.find((b) => b.id === batchId);
    if (selectedBatch) {
      const studentsInBatch = students.filter((s) =>
        selectedBatch.studentIds.includes(s.id)
      );
      setBatchStudents(studentsInBatch);
      const initialAttendance = studentsInBatch.reduce((acc, student) => {
        acc[student.id] = "unset";
        return acc;
      }, {} as AttendanceRecord);
      setAttendance(initialAttendance);
    }
  };

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Attendance Submitted",
            description: "The attendance record has been saved successfully.",
        });
    }, 1500);
  }

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Mark Attendance</CardTitle>
          <CardDescription>
            Select a batch to start marking attendance for today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleBatchChange}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name} - {batch.location} ({batch.timings})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{selectedBatch.name}</CardTitle>
            <CardDescription>
              Mark attendance for {new Date().toLocaleDateString()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="today-topic">Today's Topic</Label>
                <Input id="today-topic" placeholder="e.g., Introduction to React Hooks" />
              </div>
              <div>
                <Label htmlFor="upcoming-topic">Upcoming Topic</Label>
                <Textarea id="upcoming-topic" placeholder="e.g., State management with Context API" />
              </div>
            </div>
            <Table className="mt-6">
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-4">
                        <RadioGroup
                          value={attendance[student.id]}
                          onValueChange={(value) =>
                            handleAttendanceChange(student.id, value as AttendanceStatus)
                          }
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="present" id={`present-${student.id}`} />
                            <Label htmlFor={`present-${student.id}`}>Present</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                            <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                          </div>
                        </RadioGroup>
                        {attendance[student.id] === "absent" && (
                          <AiReasonDialog
                            student={student}
                            batch={selectedBatch}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-6">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
