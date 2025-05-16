import { Phone, BarChart3, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricsPanelProps {
  totalCalls: number
  totalRecordings: number
  availableAgents: number
}

export function MetricsPanel({ totalCalls, totalRecordings, availableAgents }: MetricsPanelProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Calls Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-gray-500" />
            <span className="text-3xl font-bold">{totalCalls}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Recordings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-gray-500" />
            <span className="text-3xl font-bold">{totalRecordings}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Available Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-gray-500" />
            <span className="text-3xl font-bold">{availableAgents}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
