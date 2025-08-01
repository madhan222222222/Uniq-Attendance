
"use client"

import * as React from "react"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2, Download } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { locations } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getReportData, type ReportData } from "@/app/actions/attendance"
import { useToast } from "@/hooks/use-toast"

// Extend jsPDF with autoTable, since the types might not be available globally
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}


export default function ReportingPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 6, 20),
    to: new Date(),
  });
  const [location, setLocation] = React.useState<string | undefined>();
  const [reportData, setReportData] = React.useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleApplyFilters = async () => {
    setIsLoading(true);
    setReportData([]);
    const result = await getReportData({
      location,
      from: date?.from,
      to: date?.to
    });
    if (result.success) {
      setReportData(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error fetching report",
        description: result.error,
      })
    }
    setIsLoading(false);
  }

  React.useEffect(() => {
    handleApplyFilters();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleDownload = () => {
    if (reportData.length === 0) {
      toast({
        variant: "destructive",
        title: "No data to download",
        description: "Please apply filters to generate a report first.",
      });
      return;
    }

    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Add a title
    doc.text("Attendance Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const tableColumn = ["Student", "Batch", "Location", "Date", "Topic Covered", "Status"];
    const tableRows: (string | null | undefined)[][] = [];

    reportData.forEach(row => {
      const rowData = [
        row.student,
        row.batch,
        row.batchLocation,
        row.date,
        row.topic,
        row.status
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      headStyles: { fillColor: [103, 58, 183] }, // Primary color
      didDrawPage: (data) => {
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save("attendance_report.pdf");

    toast({
        title: "Download Started",
        description: "Your PDF report is being generated.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Attendance Reporting</CardTitle>
          <CardDescription>Filter and view attendance records.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Select onValueChange={setLocation} value={location}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className={cn("grid gap-2")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleApplyFilters} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Filters
            </Button>
          <Button onClick={handleDownload} disabled={reportData.length === 0} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Report Results</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Topic Covered</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && reportData.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No data available for the selected filters.
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && reportData.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{row.student}</TableCell>
                            <TableCell>{row.batch}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.topic}</TableCell>
                            <TableCell>
                                <Badge variant={row.status === 'Present' ? 'secondary' : 'destructive'}>
                                    {row.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
