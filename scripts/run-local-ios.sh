#!/bin/bash
###########################################
# Local iOS Test Runner Script
# Runs tests on local iOS simulator/device
###########################################

cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

echo "=================================================="
echo "Running iOS tests locally"
echo "=================================================="

# Check if Appium server is running
if ! curl --output /dev/null --silent --head --fail http://localhost:4723/wd/hub/status; then
    echo "ERROR: Appium server is not running at http://localhost:4723"
    echo "Please start Appium server first with 'npm run appium' or 'appium'"
    exit 1
fi

# Check for iOS simulator
SIMULATOR_ID="A58EC5DC-3655-4B83-9C01-B0EC598E6A91" # Default iPhone 16 Plus simulator
DEVICE_NAME="iPhone 16 Plus"
PLATFORM_VERSION="18.6"

# Verify iOS simulator is available
if ! xcrun simctl list | grep -q "$SIMULATOR_ID"; then
    echo "ERROR: iOS simulator $DEVICE_NAME ($SIMULATOR_ID) not found."
    echo "Available simulators:"
    xcrun simctl list devices | grep -v "unavailable"
    exit 1
fi

echo "Using iOS simulator: $DEVICE_NAME ($SIMULATOR_ID)"

# Build TypeScript project
echo "Building TypeScript project..."
npm run build

# Set environment variables for local iOS testing
export TEST_ENV="qa"
export PLATFORM="ios"
export ENV="local"
export DEVICE_NAME="$DEVICE_NAME"
export UDID="$SIMULATOR_ID"
export PLATFORM_VERSION="$PLATFORM_VERSION"
export APPIUM_URL="http://localhost:4723"

# Specific feature file path - can be modified
FEATURE_PATH="src/test/features/mobile/demo.feature"
echo "Running feature: $FEATURE_PATH"

# Run the tests
echo "Running iOS tests locally..."
npx cucumber-js --profile ios --format progress $FEATURE_PATH

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
