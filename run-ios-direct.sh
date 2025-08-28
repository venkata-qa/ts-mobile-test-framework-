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

# Run the direct iOS test
echo "Running direct iOS test..."
node ios-direct-test.js

# Check the exit code
if [ $? -eq 0 ]; then
  echo "✅ iOS test completed successfully!"
  exit 0
else
  echo "❌ iOS test failed!"
  exit 1
fi
