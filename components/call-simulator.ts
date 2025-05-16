type CallStatus = "Completed" | "In Progress"

interface Call {
  id: string
  callerName: string
  age: number
  timestamp: Date
  status: CallStatus
}

export function generateRandomCall(): Call {
  // Generate random caller data
  const firstNames = ["John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava", "Robert", "Isabella"]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]

  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const randomAge = Math.floor(Math.random() * 50) + 18

  return {
    id: Date.now().toString(),
    callerName: `${randomFirstName} ${randomLastName}`,
    age: randomAge,
    timestamp: new Date(),
    status: Math.random() > 0.8 ? "In Progress" : "Completed",
  }
}
