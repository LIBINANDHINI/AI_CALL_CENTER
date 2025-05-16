import { TwilioSetup } from "@/components/twilio-setup"

export default function SetupPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Call Center Dashboard Setup</h1>
      <TwilioSetup />
    </div>
  )
}
