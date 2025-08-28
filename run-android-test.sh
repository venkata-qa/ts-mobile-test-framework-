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

echo "Running Android tests with Pixel 3 device..."

# Run a specific mobile test
cd /Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework
npx cucumber-js src/test/features/mobile/sauceLogin.feature:11 --profile android
