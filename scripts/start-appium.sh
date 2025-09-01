#!/bin/bash
###########################################
# Appium Server Starter
# Starts Appium server for local testing
###########################################

# Define the log file
LOG_FILE="./logs/appium.log"
mkdir -p ./logs

echo "Starting Appium server for mobile testing..."
echo "Log file: $LOG_FILE"

# Check if Appium is already running
if curl -s http://localhost:4723/wd/hub/status > /dev/null 2>&1; then
  echo "Appium is already running. Stopping existing instance..."
  pkill -f appium
  sleep 3
fi

# Start Appium server with debugging
echo "Starting new Appium instance..."
appium --log-level debug --log-timestamp --relaxed-security --base-path /wd/hub > $LOG_FILE 2>&1 &

# Get the PID of the Appium server
APPIUM_PID=$!
echo "Appium server started with PID: $APPIUM_PID"
echo "To stop Appium, run: kill $APPIUM_PID"

# Wait for server to start
echo "Waiting for Appium server to start..."
sleep 5

# Check if Appium is running
if ps -p $APPIUM_PID > /dev/null; then
  echo "Appium server is running. Ready for tests."
  echo "Run tests using: ./scripts/run-tests.sh --platform [android|ios] --env local"
else
  echo "Failed to start Appium server!"
  exit 1
fi

# Keep the script running to see the output
echo "Press Ctrl+C to stop viewing logs and continue. The Appium server will stay running."
tail -f $LOG_FILE
