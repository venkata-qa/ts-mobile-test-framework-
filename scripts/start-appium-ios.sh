#!/bin/bash

# Define the log file
LOG_FILE="./logs/appium.log"
mkdir -p ./logs

echo "Starting Appium server for iOS testing..."
echo "Log file: $LOG_FILE"

# Start Appium server with debugging
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
  echo "Appium server is running. Ready for iOS tests."
else
  echo "Failed to start Appium server!"
  exit 1
fi

# Keep the script running to see the output
echo "Press Ctrl+C to stop viewing logs and continue. The Appium server will stay running."
tail -f $LOG_FILE
