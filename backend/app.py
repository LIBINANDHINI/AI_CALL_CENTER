from flask import Flask, request, jsonify, url_for
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather
from datetime import datetime
from flask_cors import CORS
import uuid
import os

app = Flask(__name__)
CORS(app)

# Twilio credentials directly configured in code
ACCOUNT_SID = 'ACc9f8b7b40b7613e0e64986f4b9e77d8d'  # Replace with your actual Twilio SID
AUTH_TOKEN = 'a6bf4c98efd044876b245f48fa0f69f7'    # Replace with your actual Twilio Auth Token
TWILIO_NUMBER = '+19786843530'            # Replace with your actual Twilio number

client = Client(ACCOUNT_SID, AUTH_TOKEN)

# In-memory storage
CALLS = []
AGENTS = [
    {"id": "1", "name": "Alex Johnson", "status": "Available", "phone": "+917094745239"},
    {"id": "2", "name": "Sarah Miller", "status": "Available", "phone": "+917094745239"},
    {"id": "3", "name": "David Chen", "status": "Available", "phone": "+917094745239"},
    {"id": "4", "name": "Maria Garcia", "status": "Available", "phone": "+917094745239"},
    {"id": "5", "name": "James Wilson", "status": "Available", "phone": "+917094745239"},
]

# Temporary storage for call data during the AI conversation
CALL_DATA = {}

@app.route("/incoming_call", methods=["POST"])
def incoming_call():
    """Handle incoming calls to the Twilio number"""
    call_sid = request.values.get('CallSid')
    
    # Create a new call entry
    call_entry = {
        "id": str(uuid.uuid4()),
        "callerName": "Unknown Caller",  # Will be updated during the conversation
        "age": 0,  # Will be updated during the conversation
        "timestamp": datetime.now().isoformat(),
        "status": "In Progress",
        "sid": call_sid,
    }
    
    # Store call data temporarily
    CALL_DATA[call_sid] = call_entry
    
    # Create TwiML response
    response = VoiceResponse()
    response.say("Welcome to our AI-powered call center. I'll collect some information before connecting you to an agent.")
    
    # Ask for the caller's name
    gather = Gather(input='speech', action='/collect_name', method='POST', timeout=5, speechTimeout='auto')
    gather.say("Please state your name.")
    response.append(gather)
    
    # If no input is received
    response.say("We didn't receive any input. Let's try again.")
    response.redirect('/incoming_call')
    
    return str(response)

@app.route("/collect_name", methods=["POST"])
def collect_name():
    """Collect the caller's name"""
    call_sid = request.values.get('CallSid')
    speech_result = request.values.get('SpeechResult', '')
    
    # Update call data with name
    if call_sid in CALL_DATA:
        CALL_DATA[call_sid]["callerName"] = speech_result
    
    # Create TwiML response
    response = VoiceResponse()
    
    # Ask for the caller's age
    gather = Gather(input='dtmf speech', action='/collect_age', method='POST', timeout=5, speechTimeout='auto')
    gather.say(f"Thank you, {speech_result}. Please say or enter your age using the keypad.")
    response.append(gather)
    
    # If no input is received
    response.say("We didn't receive any input. Let's try again.")
    response.redirect('/collect_name')
    
    return str(response)

@app.route("/collect_age", methods=["POST"])
def collect_age():
    """Collect the caller's age"""
    call_sid = request.values.get('CallSid')
    
    # Try to get age from speech or dtmf
    speech_result = request.values.get('SpeechResult', '')
    dtmf_result = request.values.get('Digits', '')
    
    age = 0
    if dtmf_result:
        try:
            age = int(dtmf_result)
        except ValueError:
            age = 0
    elif speech_result:
        # Try to extract a number from the speech result
        import re
        age_match = re.search(r'\b(\d+)\b', speech_result)
        if age_match:
            try:
                age = int(age_match.group(1))
            except ValueError:
                age = 0
    
    # Update call data with age
    if call_sid in CALL_DATA:
        CALL_DATA[call_sid]["age"] = age
    
    # Create TwiML response
    response = VoiceResponse()
    response.say(f"Thank you for providing your information. We'll now connect you to an available agent.")
    
    # Find an available agent
    available_agent = next((agent for agent in AGENTS if agent["status"] == "Available"), None)
    
    if available_agent:
        # Update agent status
        available_agent["status"] = "Busy"
        
        # Add call to the list
        if call_sid in CALL_DATA:
            call_entry = CALL_DATA[call_sid]
            CALLS.insert(0, call_entry)
            del CALL_DATA[call_sid]  # Remove from temporary storage
        
        # Connect to the agent
        response.say(f"Connecting you to {available_agent['name']}. Please hold.")
        response.dial(available_agent["phone"], 
                      action='/call_complete',
                      record='record-from-answer',
                      recordingStatusCallback='/recording')
    else:
        response.say("We're sorry, but all agents are currently busy. Please try again later.")
        response.hangup()
    
    return str(response)

@app.route("/call_complete", methods=["POST"])
def call_complete():
    """Handle call completion"""
    call_sid = request.values.get('CallSid')
    
    # Update call status
    for call in CALLS:
        if call.get("sid") == call_sid:
            call["status"] = "Completed"
            break
    
    response = VoiceResponse()
    response.say("Thank you for calling. Goodbye!")
    
    return str(response)

@app.route("/recording", methods=["POST"])
def save_recording():
    """Save recording URL"""
    call_sid = request.form.get("CallSid")
    recording_url = request.form.get("RecordingUrl")
    
    for call in CALLS:
        if call.get("sid") == call_sid:
            call["status"] = "Completed"
            call["recordingUrl"] = recording_url + ".mp3"
            break
    
    # Update agent status
    for agent in AGENTS:
        if agent["status"] == "Busy":
            agent["status"] = "Available"
    
    return '', 204

@app.route("/calls", methods=["GET"])
def get_calls():
    """Get recent calls"""
    return jsonify(CALLS[:5])

@app.route("/agents", methods=["GET"])
def get_agents():
    """Get agent status"""
    return jsonify(AGENTS)

@app.route("/webhook_url", methods=["GET"])
def get_webhook_url():
    """Get the webhook URL for Twilio configuration"""
    base_url = request.host_url.rstrip('/')
    webhook_url = f"{base_url}/incoming_call"
    
    return jsonify({
        "webhook_url": webhook_url
    })

if __name__ == "__main__":
    app.run(debug=True)
