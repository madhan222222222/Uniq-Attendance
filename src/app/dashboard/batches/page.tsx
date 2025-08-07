
"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Batch } from "@/lib/data";
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
import { Badge } from "@/components/ui/badge";
import { AddBatchDialog } from "@/components/batches/add-batch-dialog";
import { useSearchParams } from "next/navigation";

function BatchesContent() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  async function fetchBatches() {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(db, "batches"));
    const batchesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Batch[];
    setBatches(batchesData);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleBatchAdded = () => {
    fetchBatches();
    setIsDialogOpen(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Batches</CardTitle>
          <CardDescription>Manage course batches and student assignments.</CardDescription>
        </div>
         {role === 'admin' && (
          <AddBatchDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onBatchAdded={handleBatchAdded}>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Batch
            </Button>
          </AddBatchDialog>
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
                <TableHead>Batch Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timings</TableHead>
                <TableHead>Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>{batch.location}</TableCell>
                  <TableCell>{batch.timings}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{batch.studentIds.length}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}


export default function BatchesPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}>
      <BatchesContent />
    </Suspense>
  )
}
