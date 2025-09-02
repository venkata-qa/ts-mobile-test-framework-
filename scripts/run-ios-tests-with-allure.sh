#!/bin/bash
###########################################
# iOS Allure Test Runner Script
# Runs iOS tests with Allure reporting
###########################################

cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

echo "=================================================="
echo "Running iOS tests with Allure reporting"
echo "=================================================="

# Clean allure-results directory but keep history
echo "Cleaning allure results directory..."
mkdir -p allure-results/history
mkdir -p allure-report/history
if [ -d "allure-report/history" ]; then
  cp -R allure-report/history allure-results/ 2>/dev/null || :
fi
find allure-results -maxdepth 1 -type f -delete

# Set environment variables
export TEST_ENV=${TEST_ENV:-"qa"}
export PLATFORM="ios"
export APPIUM_URL="http://localhost:4723"

# Check if Appium server is running
if ! curl --output /dev/null --silent --head --fail http://localhost:4723/wd/hub/status; then
  echo "Starting Appium server..."
  ./scripts/start-appium.sh &
  sleep 5
fi

# Run the tests with allure
echo "Running iOS tests with allure reporting..."
npm run test:ios:allure

# Generate and open the report
echo "Generating Allure report..."
npm run report
