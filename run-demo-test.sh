#!/bin/bash

# Set up the environment for running mobile tests
export APPIUM_URL="http://localhost:4723"
export TEST_ENV=qa
export PLATFORM=android

# Check if Appium is running, if not start it
if ! pgrep -x "appium" > /dev/null; then
  echo "Starting Appium server..."
  appium &>/dev/null &
  # Give Appium time to initialize
  sleep 2
fi

echo "Running Demo Login Test with Pixel 3 device..."

# Run our simple demo test
cd /Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework

# Using the androiddemo tag to run only our specific test
npx cucumber-js \
  --require-module ts-node/register \
  --require src/test/support/**/*.ts \
  --require src/test/steps/mobile/**/*.ts \
  --require src/test/steps/common/**/*.ts \
  --format progress \
  --tags @androiddemo
