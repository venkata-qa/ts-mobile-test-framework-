#!/bin/bash
###########################################
# iOS Demo Test Runner Script
# Runs iOS demo tests with proper configuration
###########################################

# Source common utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/common.sh"

# Set platform-specific environment variables
export PLATFORM=ios
export DEVICE_NAME=${DEVICE_NAME:-"iPhone 16 Plus"}
export PLATFORM_VERSION=${PLATFORM_VERSION:-"18.6"}
export UDID=${UDID:-"A58EC5DC-3655-4B83-9C01-B0EC598E6A91"}

# Print the header
log_info "Starting iOS Demo tests"
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

# Run iOS demo tests with the iosdemo tag and debug mode for WebDriver
log_info "Running iOS demo tests..."
DEBUG=webdriver* run_cucumber "@iosdemo" "ios" "--format progress"

# Store the exit code
EXIT_CODE=$?

log_info "Test execution complete!"
exit $EXIT_CODE
