"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { getAbsenceReasonSuggestion } from "@/app/actions/attendance";
import type { Student, Batch } from "@/lib/data";
import { knownAbsenceReasons } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type AiReasonDialogProps = {
  student: Student;
  batch: Batch;
};

export function AiReasonDialog({ student, batch }: AiReasonDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reasonCode, setReasonCode] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setReasonCode("");
    setMessage("");

    const input = {
      studentName: student.name,
      batchDetails: `${batch.name} at ${batch.location} (${batch.timings})`,
      date: new Date().toLocaleDateString(),
      knownAbsenceReasons: knownAbsenceReasons,
    };

    const result = await getAbsenceReasonSuggestion(input);

    if (result.success && result.data) {
      setReasonCode(result.data.reasonCode);
      setMessage(result.data.message);
    } else {
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: result.error || "Could not generate suggestions.",
      });
    }

    setIsLoading(false);
  };

  const handleSendNotification = () => {
    // Simulate sending email
    toast({
        title: "Notification Sent",
        description: `An absence notification has been sent for ${student.name}.`,
    })
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">AI Absence Assistant</DialogTitle>
          <DialogDescription>
            Generate a reason code and message for {student.name}'s absence.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Student</Label>
            <Input value={student.name} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Batch</Label>
            <Input value={batch.name} readOnly className="col-span-3" />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Suggestion
          </Button>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason-code" className="text-right">
              Reason Code
            </Label>
            <Input
              id="reason-code"
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="col-span-3"
              placeholder="e.g., SICK_LEAVE"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              placeholder="Message to send to parents..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSendNotification}>Send Notification</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
