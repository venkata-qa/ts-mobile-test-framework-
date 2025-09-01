#!/bin/bash
###########################################
# Local Android Test Runner Script
# Runs tests on local Android emulator/device
###########################################

cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

echo "=================================================="
echo "Running Android tests locally"
echo "=================================================="

# Check if Appium server is running
if ! curl --output /dev/null --silent --head --fail http://localhost:4723/wd/hub/status; then
    echo "ERROR: Appium server is not running at http://localhost:4723"
    echo "Please start Appium server first with 'npm run appium' or 'appium'"
    exit 1
fi

# Check for Android device
DEVICE_ID=$(adb devices | grep -v "List" | grep -v "^$" | head -n 1 | awk '{print $1}')

if [ -z "$DEVICE_ID" ]; then
    echo "ERROR: No Android device or emulator detected."
    echo "Please make sure your Android emulator or device is connected."
    exit 1
fi

echo "Using Android device: $DEVICE_ID"

# Build TypeScript project
echo "Building TypeScript project..."
npm run build

# Set environment variables for local Android testing
export TEST_ENV="qa"
export PLATFORM="android"
export ENV="local"
export DEVICE_NAME="$DEVICE_ID"
export PLATFORM_VERSION="16"  # Adjust as needed
export APPIUM_URL="http://localhost:4723"

# Specific feature file path - can be modified
FEATURE_PATH="src/test/features/mobile/demo.feature"
echo "Running feature: $FEATURE_PATH"

# Run the tests
echo "Running Android tests locally..."
npx cucumber-js --profile android --format progress $FEATURE_PATH

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
