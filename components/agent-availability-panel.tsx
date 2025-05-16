import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type AgentStatus = "Available" | "Busy" | "Offline"

interface Agent {
  id: string
  name: string
  status: AgentStatus
}

interface AgentAvailabilityPanelProps {
  agents: Agent[]
}

export function AgentAvailabilityPanel({ agents }: AgentAvailabilityPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full mr-3 ${
                    agent.status === "Available"
                      ? "bg-green-500"
                      : agent.status === "Busy"
                        ? "bg-amber-500"
                        : "bg-gray-400"
                  }`}
                />
                <span>{agent.name}</span>
              </div>
              <Badge
                variant={
                  agent.status === "Available" ? "outline" : agent.status === "Busy" ? "secondary" : "destructive"
                }
              >
                {agent.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
