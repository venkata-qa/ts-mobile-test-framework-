#!/bin/bash

# Run our simple iOS demo test
cd /Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework

# Set up the environment for running iOS mobile tests
export APPIUM_URL="http://localhost:4723"
export TEST_ENV=qa
export PLATFORM=ios

echo "========================================================================"
echo "IMPORTANT: To run iOS tests, you need to have:"
echo "1. XCUITest driver installed: appium driver install xcuitest"
echo "2. Xcode installed with iOS simulators"
echo "3. iOS simulator iPhone 16 Plus running with UDID: A58EC5DC-3655-4B83-9C01-B0EC598E6A91"
echo "4. The Sauce Labs demo app installed on the simulator"
echo "========================================================================"

echo "Starting Appium server..."
echo "Running iOS Demo Login Test with iPhone 16 Plus device..."

# Using the iosdemo tag to run only our specific test
npx cucumber-js \
  --require-module ts-node/register \
  --require src/test/support/**/*.ts \
  --require src/test/steps/mobile/**/*.ts \
  --require src/test/steps/common/**/*.ts \
  --format progress \
  --tags @iosdemo
