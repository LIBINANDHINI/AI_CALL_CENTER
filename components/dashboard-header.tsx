"use client"

import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  onSimulateCall: () => void
}

export function DashboardHeader({ onSimulateCall }: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Call Center Dashboard</h1>
        <p className="text-gray-500">Monitor calls and agent performance</p>
      </div>
      <Button className="mt-4 md:mt-0" onClick={onSimulateCall} size="lg">
        <Phone className="mr-2 h-4 w-4" /> Simulate Call
      </Button>
    </header>
  )
}
