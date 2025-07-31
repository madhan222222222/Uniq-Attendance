"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
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

const mockReportData = [
  { student: 'Aarav Kumar', batch: 'Morning Physics', date: '2024-07-28', status: 'Present', topic: 'Kinematics' },
  { student: 'Priya Singh', batch: 'Morning Physics', date: '2024-07-28', status: 'Absent', topic: 'Kinematics' },
  { student: 'Diya Sharma', batch: 'Evening Maths', date: '2024-07-27', status: 'Present', topic: 'Calculus' },
  { student: 'Rohan Patel', batch: 'Weekend Chemistry', date: '2024-07-26', status: 'Present', topic: 'Organic Chemistry' },
]

export default function ReportingPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 6, 20),
    to: new Date(),
  })

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Attendance Reporting</CardTitle>
          <CardDescription>Filter and view attendance records.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
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
          <Button>Apply Filters</Button>
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
                    {mockReportData.map((row, index) => (
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
