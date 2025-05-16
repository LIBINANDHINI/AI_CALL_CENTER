"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface TwilioCredentials {
  accountSid: string
  authToken: string
  twilioNumber: string
}

export function TwilioSetup() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<TwilioCredentials>({
    accountSid: "",
    authToken: "",
    twilioNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/setup_twilio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Twilio credentials have been set up successfully.",
        })

        // Redirect to dashboard after successful setup
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to set up Twilio credentials")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set up Twilio credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Twilio Setup</CardTitle>
        <CardDescription>Enter your Twilio credentials to enable the AI call center</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountSid">Account SID</Label>
            <Input
              id="accountSid"
              name="accountSid"
              value={credentials.accountSid}
              onChange={handleChange}
              placeholder="Enter your Twilio Account SID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authToken">Auth Token</Label>
            <Input
              id="authToken"
              name="authToken"
              type="password"
              value={credentials.authToken}
              onChange={handleChange}
              placeholder="Enter your Twilio Auth Token"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twilioNumber">Twilio Phone Number</Label>
            <Input
              id="twilioNumber"
              name="twilioNumber"
              value={credentials.twilioNumber}
              onChange={handleChange}
              placeholder="+1234567890"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Setting up..." : "Save Credentials"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-gray-500 mb-4">Your credentials will be securely stored on the server.</p>
        <div className="text-sm border-t pt-4 w-full">
          <h4 className="font-medium mb-2">Next Steps After Setup:</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Configure your Twilio phone number to use the webhook URL shown on the dashboard</li>
            <li>Test by calling your Twilio number</li>
            <li>The AI will answer, ask for name and age, then connect to an available agent</li>
          </ol>
        </div>
      </CardFooter>
    </Card>
  )
}
