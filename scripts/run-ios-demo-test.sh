#!/bin/bash

# Set environment variables
export NODE_ENV=qa
export TEST_ENV=qa
export PLATFORM=ios
export APPIUM_URL="http://localhost:4723"

# Print debug information
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "TEST_ENV: $TEST_ENV"
echo "PLATFORM: $PLATFORM"
echo "APPIUM_URL: $APPIUM_URL"

# Build the project to ensure TypeScript is compiled
echo "Building project..."
npm run build

# Apply comprehensive fix to make sure all iOS configurations use the correct simulator
echo "Applying iOS simulator fix..."
node fix-ios-simulator.js

# Run only the iOS demo tests with verbose logging
echo "Running iOS demo tests..."
DEBUG=webdriver* npx cucumber-js -p ios
