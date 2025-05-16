import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type CallStatus = "Completed" | "In Progress"

interface Call {
  id: string
  callerName: string
  age: number
  timestamp: Date
  status: CallStatus
}

interface CallRecordingsTableProps {
  calls: Call[]
}

export function CallRecordingsTable({ calls }: CallRecordingsTableProps) {
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Recordings</CardTitle>
      </CardHeader>
      <CardContent>
        {calls.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recording</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.callerName}</TableCell>
                  <TableCell>{call.age}</TableCell>
                  <TableCell>
                    {formatDate(call.timestamp)} at {formatTime(call.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={call.status === "Completed" ? "default" : "secondary"}>{call.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>No calls recorded yet. Click "Simulate Call" to begin.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
