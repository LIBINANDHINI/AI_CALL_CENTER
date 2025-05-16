"use client"

import { useState, useEffect } from "react"
import { Phone, Play, Users, PhoneIncoming, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Types
type CallStatus = "Completed" | "In Progress"
type AgentStatus = "Available" | "Busy" | "Offline"

interface Call {
  id: string
  callerName: string
  age: number
  timestamp: string
  status: CallStatus
  recordingUrl?: string
  sid?: string
}

interface Agent {
  id: string
  name: string
  status: AgentStatus
  phone: string
}

// API URL - replace with your Flask app URL
const API_URL = "http://localhost:5000"

export default function Dashboard() {
  // State for calls, agents, and metrics
  const [calls, setCalls] = useState<Call[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [totalCalls, setTotalCalls] = useState(0)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [callsToday, setCallsToday] = useState(0)
  const [avgCallDuration, setAvgCallDuration] = useState("0:00")

  // Fetch initial data
  useEffect(() => {
    fetchCalls()
    fetchAgents()
    fetchWebhookUrl()
  }, [])

  // Fetch webhook URL
  const fetchWebhookUrl = async () => {
    try {
      const response = await fetch(`${API_URL}/webhook_url`)
      if (response.ok) {
        const data = await response.json()
        setWebhookUrl(data.webhook_url)
      }
    } catch (error) {
      console.error("Error fetching webhook URL:", error)
    }
  }

  // Fetch calls from API
  const fetchCalls = async () => {
    try {
      const response = await fetch(`${API_URL}/calls`)
      if (response.ok) {
        const data = await response.json()
        setCalls(data)
        setTotalCalls(data.length)

        // Calculate calls today
        const today = new Date().toDateString()
        const todayCalls = data.filter((call) => new Date(call.timestamp).toDateString() === today).length
        setCallsToday(todayCalls)

        // Simulate average call duration (in a real app, this would come from the backend)
        setAvgCallDuration(
          Math.floor(Math.random() * 5) +
            2 +
            ":" +
            Math.floor(Math.random() * 60)
              .toString()
              .padStart(2, "0"),
        )
      }
    } catch (error) {
      console.error("Error fetching calls:", error)
    }
  }

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_URL}/agents`)
      if (response.ok) {
        const data = await response.json()
        setAgents(data)
      }
    } catch (error) {
      console.error("Error fetching agents:", error)
    }
  }

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCalls()
      fetchAgents()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Calculate metrics
  const availableAgents = agents.filter((agent) => agent.status === "Available").length
  const completedCalls = calls.filter((call) => call.status === "Completed").length
  const inProgressCalls = calls.filter((call) => call.status === "In Progress").length

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <Toaster />
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Call Center Dashboard</h1>
          <p className="text-gray-500">Monitor AI-powered calls and agent performance</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col md:items-end">
          <Badge variant="outline" className="mb-2">
            Twilio Configured
          </Badge>
          <div className="text-sm text-gray-500">
            <span className="font-medium">Incoming Call Webhook:</span>
            <br />
            <span className="text-xs break-all">{webhookUrl || "Loading..."}</span>
          </div>
        </div>
      </header>

      <Alert className="mb-6">
        <PhoneIncoming className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          When customers call your Twilio number, our AI assistant will answer, collect their name and age, and then
          connect them to an available agent. All calls are recorded for quality assurance.
        </AlertDescription>
      </Alert>

      {/* Metrics Section */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Calls</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-500">Calls Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PhoneIncoming className="mr-2 h-5 w-5 text-gray-500" />
              <span className="text-3xl font-bold">{callsToday}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Call Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-500" />
              <span className="text-3xl font-bold">{avgCallDuration}</span>
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
              <span className="text-3xl font-bold">
                {availableAgents}/{agents.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Call Recordings Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Calls</CardTitle>
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
                          {call.recordingUrl ? (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={call.recordingUrl} target="_blank" rel="noopener noreferrer">
                                <Play className="h-4 w-4" />
                              </a>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" disabled>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <p>No incoming calls yet. Configure your Twilio number to use the webhook URL above.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agent Availability Section */}
        <div>
          <Card className="mb-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Call Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed</span>
                  <Badge variant="outline">{completedCalls}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Progress</span>
                  <Badge variant="secondary">{inProgressCalls}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total</span>
                  <Badge variant="default">{totalCalls}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
