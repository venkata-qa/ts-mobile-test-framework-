#!/bin/bash
###########################################
# Appium Server Starter for iOS Testing
# Starts Appium server with proper configuration for iOS testing
###########################################

# Source common utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/common.sh"

# Define the log file
LOG_FILE="$PROJECT_ROOT/logs/appium.log"
mkdir -p "$PROJECT_ROOT/logs"

log_info "Starting Appium server for iOS testing..."
log_info "Log file: $LOG_FILE"

# Start Appium server with debugging
appium --log-level debug --log-timestamp --relaxed-security --base-path /wd/hub > $LOG_FILE 2>&1 &

# Get the PID of the Appium server
APPIUM_PID=$!
log_success "Appium server started with PID: $APPIUM_PID"
echo "To stop Appium, run: kill $APPIUM_PID"

# Wait for server to start
log_info "Waiting for Appium server to start..."
sleep 5

# Check if Appium is running
if ps -p $APPIUM_PID > /dev/null; then
  log_success "Appium server is running. Ready for iOS tests."
else
  log_error "Failed to start Appium server!"
  exit 1
fi

# Keep the script running to see the output
log_info "Press Ctrl+C to stop viewing logs and continue. The Appium server will stay running."
tail -f $LOG_FILE
