#!/bin/bash
###########################################
# Android Test Runner Script
# Runs Android tests with proper configuration
###########################################

# Source common utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/common.sh"

# Set platform-specific environment variables
export PLATFORM=android
export DEVICE_NAME=${DEVICE_NAME:-"emulator-5554"}
export PLATFORM_VERSION=${PLATFORM_VERSION:-"16"}

# Print the header
log_info "Starting Android tests"

# Print requirements
print_platform_requirements "android"

# Build the project
ensure_built

# Run Android tests with the android tag
log_info "Running Android tests..."
run_cucumber "@android or @androiddemo" "android" "--format progress --format json:cucumber-report.json"

# Store the exit code
EXIT_CODE=$?

log_info "Test execution complete!"
exit $EXIT_CODE
