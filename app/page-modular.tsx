"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsPanel } from "@/components/metrics-panel"
import { CallRecordingsTable } from "@/components/call-recordings-table"
import { AgentAvailabilityPanel } from "@/components/agent-availability-panel"
import { generateRandomCall } from "@/components/call-simulator"

// Types
type CallStatus = "Completed" | "In Progress"
type AgentStatus = "Available" | "Busy" | "Offline"

interface Call {
  id: string
  callerName: string
  age: number
  timestamp: Date
  status: CallStatus
}

interface Agent {
  id: string
  name: string
  status: AgentStatus
}

export default function Dashboard() {
  // State for calls, agents, and metrics
  const [calls, setCalls] = useState<Call[]>([])
  const [agents, setAgents] = useState<Agent[]>([
    { id: "1", name: "Alex Johnson", status: "Available" },
    { id: "2", name: "Sarah Miller", status: "Busy" },
    { id: "3", name: "David Chen", status: "Available" },
    { id: "4", name: "Maria Garcia", status: "Offline" },
    { id: "5", name: "James Wilson", status: "Available" },
  ])
  const [totalCalls, setTotalCalls] = useState(0)

  // Function to simulate a new call
  const simulateCall = () => {
    const newCall = generateRandomCall()

    // Update calls list (keep only the last 5)
    setCalls((prevCalls) => [newCall, ...prevCalls].slice(0, 5))

    // Increment total calls
    setTotalCalls((prev) => prev + 1)

    // Randomly update agent statuses
    updateAgentStatuses()
  }

  // Function to update agent statuses randomly
  const updateAgentStatuses = () => {
    const statuses: AgentStatus[] = ["Available", "Busy", "Offline"]

    setAgents((prevAgents) =>
      prevAgents.map((agent) => ({
        ...agent,
        status: Math.random() > 0.7 ? statuses[Math.floor(Math.random() * statuses.length)] : agent.status,
      })),
    )
  }

  // Calculate metrics
  const availableAgents = agents.filter((agent) => agent.status === "Available").length

  return (
    <div className="min-h-screen bg-white p-6">
      <DashboardHeader onSimulateCall={simulateCall} />

      <MetricsPanel totalCalls={totalCalls} totalRecordings={calls.length} availableAgents={availableAgents} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <CallRecordingsTable calls={calls} />
        </div>

        <div>
          <AgentAvailabilityPanel agents={agents} />
        </div>
      </div>
    </div>
  )
}
