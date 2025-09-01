#!/bin/bash
###########################################
# BrowserStack Test Runner Script
# Runs tests on BrowserStack with proper configuration
###########################################

cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

# Set default platform
PLATFORM=${1:-"android"}

# Validate platform
if [[ "$PLATFORM" != "android" && "$PLATFORM" != "ios" ]]; then
    echo "ERROR: Platform must be either 'android' or 'ios'"
    echo "Usage: $0 [android|ios]"
    exit 1
fi

echo "=================================================="
echo "Running $PLATFORM tests on BrowserStack"
echo "=================================================="

# Build TypeScript project
echo "Building TypeScript project..."
npm run build

# Load environment variables from .env file
if [ -f ".env" ]; then
    echo "Loading BrowserStack credentials from .env file"
    set -a
    source ".env"
    set +a
else
    echo "ERROR: .env file not found. Please create a .env file with BrowserStack credentials."
    exit 1
fi

# Check if credentials are available
if [ -z "$BROWSERSTACK_USERNAME" ] || [ -z "$BROWSERSTACK_ACCESS_KEY" ]; then
    echo "ERROR: BrowserStack credentials not found in .env file"
    exit 1
fi

# Set platform-specific configurations
if [[ "$PLATFORM" == "android" ]]; then
    # Check if Android app ID is available
    if [ -z "$BROWSERSTACK_ANDROID_APP_ID" ]; then
        echo "ERROR: BROWSERSTACK_ANDROID_APP_ID not found in .env file"
        exit 1
    fi
    
    export BROWSERSTACK_APP_ID="$BROWSERSTACK_ANDROID_APP_ID"
    export DEVICE_NAME="Google Pixel 7"
    export PLATFORM_VERSION="13.0"
else
    # Check if iOS app ID is available
    if [ -z "$BROWSERSTACK_IOS_APP_ID" ]; then
        echo "ERROR: BROWSERSTACK_IOS_APP_ID not found in .env file"
        exit 1
    fi
    
    export BROWSERSTACK_APP_ID="$BROWSERSTACK_IOS_APP_ID"
    export DEVICE_NAME="iPhone 14"
    export PLATFORM_VERSION="16"
fi

# Set common BrowserStack configuration
export APPIUM_URL="https://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub"
export ENV="browserstack"
export TEST_ENV="qa"

echo "Using BrowserStack with username: $BROWSERSTACK_USERNAME"
echo "Device: $DEVICE_NAME, Version: $PLATFORM_VERSION"
echo "App ID: $BROWSERSTACK_APP_ID"

# Specific feature file path - can be changed as needed
FEATURE_PATH="src/test/features/mobile/demo.feature"
echo "Running feature: $FEATURE_PATH"

# Run the tests
echo "Running tests on BrowserStack..."
npx cucumber-js --profile $PLATFORM --format progress $FEATURE_PATH

# Capture the exit code
TEST_EXIT_CODE=$?
echo "Test execution completed with exit code: $TEST_EXIT_CODE"

# Generate Allure report if tests were run
if [ -d "allure-results" ]; then
    echo "Generating Allure report..."
    npx allure generate --clean
    echo "Allure report generated in allure-report directory"
fi

# Exit with the status from the test run
exit $TEST_EXIT_CODE
