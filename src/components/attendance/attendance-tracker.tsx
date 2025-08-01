"use client";

import { useState, useEffect } from "react";
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
import type { Student, Batch } from "@/lib/data";
import { AiReasonDialog } from "./ai-reason-dialog";
import { useToast } from "@/hooks/use-toast";
import { submitAttendance } from "@/app/actions/attendance";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

type AttendanceStatus = "present" | "absent" | "unset";
type AttendanceRecord = Record<string, AttendanceStatus>;

export function AttendanceTracker() {
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [batchStudents, setBatchStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayTopic, setTodayTopic] = useState("");
  const [upcomingTopic, setUpcomingTopic] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBatches() {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "batches"));
      const batchesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Batch[];
      setAllBatches(batchesData);
      setIsLoading(false);
    }
    fetchBatches();
  }, []);

  const handleBatchChange = async (batchId: string) => {
    setSelectedBatchId(batchId);
    setIsLoading(true);
    const selectedBatch = allBatches.find((b) => b.id === batchId);
    if (selectedBatch) {
      const studentPromises = selectedBatch.studentIds.map(id => getDoc(doc(db, "students", id)));
      const studentDocs = await Promise.all(studentPromises);
      const studentsInBatch = studentDocs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];

      setBatchStudents(studentsInBatch);
      const initialAttendance = studentsInBatch.reduce((acc, student) => {
        acc[student.id] = "present"; // Default to present
        return acc;
      }, {} as AttendanceRecord);
      setAttendance(initialAttendance);
    }
    setIsLoading(false);
  };

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };
  
  const handleSubmit = async () => {
    if (!selectedBatchId) return;
    setIsSubmitting(true);
    
    const payload = {
        batchId: selectedBatchId,
        date: new Date().toISOString(),
        todayTopic,
        upcomingTopic,
        attendance,
    };

    const result = await submitAttendance(payload);

    setIsSubmitting(false);

    if (result.success) {
        toast({
            title: "Attendance Submitted",
            description: "The attendance record has been saved successfully.",
        });
        // Reset form
        setSelectedBatchId(null);
        setBatchStudents([]);
        setAttendance({});
        setTodayTopic("");
        setUpcomingTopic("");

    } else {
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: result.message,
        })
    }
  }

  const selectedBatch = allBatches.find((b) => b.id === selectedBatchId);
  const isSubmitDisabled = isSubmitting || Object.values(attendance).some(s => s === 'unset') || isLoading;

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
          {isLoading && !selectedBatchId ? (
             <div className="flex justify-center items-center h-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
          ) : (
            <Select onValueChange={handleBatchChange} value={selectedBatchId || ""}>
                <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a Batch" />
                </SelectTrigger>
                <SelectContent>
                {allBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                    {batch.name} - {batch.location} ({batch.timings})
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedBatchId && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{selectedBatch?.name}</CardTitle>
            <CardDescription>
              Mark attendance for {new Date().toLocaleDateString()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="today-topic">Today's Topic</Label>
                    <Input id="today-topic" placeholder="e.g., Introduction to React Hooks" value={todayTopic} onChange={e => setTodayTopic(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="upcoming-topic">Upcoming Topic</Label>
                    <Textarea id="upcoming-topic" placeholder="e.g., State management with Context API" value={upcomingTopic} onChange={e => setUpcomingTopic(e.target.value)} />
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
                            {attendance[student.id] === "absent" && selectedBatch && (
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
                    <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                    </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
