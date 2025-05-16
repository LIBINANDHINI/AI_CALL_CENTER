# AI-Powered Call Center

This project implements an AI-powered call center that handles incoming calls, collects customer information, and routes calls to available agents.

## How It Works

1. **Customer Calls the Twilio Number**
   - When a customer calls your Twilio number, the AI assistant answers

2. **AI Voice Interaction**
   - The AI asks for the caller's name using speech recognition
   - The AI asks for the caller's age using speech or keypad input
   - All information is stored for the agent

3. **Agent Connection**
   - The AI finds an available agent and connects the call
   - The call is recorded for quality assurance
   - The dashboard updates in real-time

4. **Dashboard Monitoring**
   - Supervisors can see all incoming calls and their status
   - Recordings are available for playback
   - Agent availability is tracked in real-time

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   \`\`\`
   cd backend
   \`\`\`

2. Install the required Python packages:
   \`\`\`
   pip install flask twilio flask-cors
   \`\`\`

3. Update the Twilio credentials in `app.py`:
   ```python
   ACCOUNT_SID = 'your_twilio_account_sid'
   AUTH_TOKEN = 'your_twilio_auth_token'
   TWILIO_NUMBER = 'your_twilio_phone_number'
   \`\`\`

4. Start the Flask server:
   \`\`\`
   python app.py
   \`\`\`

### 2. Frontend Setup

1. Install the required npm packages:
   \`\`\`
   npm install
   \`\`\`

2. Start the Next.js development server:
   \`\`\`
   npm run dev
   \`\`\`

3. Open your browser and navigate to `http://localhost:3000`

### 3. Twilio Configuration

1. Configure your Twilio phone number to use the webhook URL shown on the dashboard for incoming calls
2. Test the system by calling your Twilio number

## Features

- AI-powered call handling with speech recognition
- Automatic call routing to available agents
- Call recording and playback
- Real-time dashboard updates
- Agent availability tracking
\`\`\`

```txt file="explanation.txt"
# AI-Powered Call Center: Logic and Approach

My approach to building this AI-powered call center focused on creating a seamless experience for callers while providing comprehensive monitoring capabilities for supervisors.

## Core Components

1. **AI Voice Assistant**: The system uses Twilio's programmable voice capabilities to create an interactive voice response system. When a caller reaches the Twilio number, they're greeted by an AI assistant that collects their name (using speech recognition) and age (via speech or keypad input). This information is stored and passed to the human agent who eventually takes the call.

2. **Intelligent Call Routing**: The backend maintains a pool of agents with real-time status tracking (Available, Busy, Offline). When a caller completes the AI interaction, the system automatically finds an available agent and connects the call. If all agents are busy, the caller is informed and asked to try again later.

3. **Real-Time Dashboard**: The dashboard provides supervisors with a comprehensive view of call center operations, including:
   - Total calls and calls today
   - Average call duration
   - Agent availability status
   - Call recordings with playback functionality
   - Real-time call status updates

## Technical Implementation

The solution uses a Flask backend to handle Twilio webhooks and manage call flow, while a Next.js frontend provides the monitoring dashboard. Key technical aspects include:

- **Webhook Architecture**: The system uses webhooks to handle the entire call flow, from initial answer to agent connection
- **TwiML Generation**: Dynamic TwiML responses guide the conversation based on caller input
- **Speech Recognition**: Leveraging Twilio's built-in speech recognition capabilities
- **Call Recording**: Automatic recording of agent conversations for quality assurance
- **Real-Time Updates**: Polling mechanism to keep the dashboard current with minimal latency

This approach creates a scalable, efficient call center solution that reduces agent workload by automating initial customer interactions while maintaining a high-quality customer experience.
