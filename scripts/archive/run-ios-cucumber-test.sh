#!/bin/bash
###########################################
# iOS Cucumber Test Runner
# Runs iOS tests using Cucumber with debug output
###########################################

# Source common utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/common.sh"

# Set platform-specific environment variables
export PLATFORM=ios
export DEVICE_NAME=${DEVICE_NAME:-"iPhone 16 Plus"}
export PLATFORM_VERSION=${PLATFORM_VERSION:-"18.6"}
export UDID=${UDID:-"A58EC5DC-3655-4B83-9C01-B0EC598E6A91"}
export DEBUG=webdriver*

# Print the header
log_info "Starting iOS Cucumber tests with debug output"
log_info "Environment variables:"
log_info "NODE_ENV: $NODE_ENV"
log_info "TEST_ENV: $TEST_ENV"
log_info "PLATFORM: $PLATFORM"
log_info "DEVICE_NAME: $DEVICE_NAME"
log_info "PLATFORM_VERSION: $PLATFORM_VERSION" 
log_info "APPIUM_URL: $APPIUM_URL"

# Print requirements
print_platform_requirements "ios"

# Build the project
ensure_built

# Run iOS tests with debug mode
log_info "Running iOS tests with direct simulator connection..."
run_cucumber "@ios" "ios" "--format progress"

# Store the exit code
EXIT_CODE=$?

log_info "Test execution complete!"
exit $EXIT_CODE
