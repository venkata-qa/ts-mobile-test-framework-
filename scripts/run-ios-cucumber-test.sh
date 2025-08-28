#!/bin/bash

# Set environment variables
export NODE_ENV=qa
export TEST_ENV=qa
export PLATFORM=ios
export APPIUM_URL="http://localhost:4723"
export DEBUG=webdriver*

# Print debug information
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "TEST_ENV: $TEST_ENV"
echo "PLATFORM: $PLATFORM"
echo "APPIUM_URL: $APPIUM_URL"

# Build the project
echo "Building project..."
npm run clean
npm run build

# Run iOS tests with our specialized hooks
echo "Running iOS tests with direct simulator connection..."
npx cucumber-js -p ios
