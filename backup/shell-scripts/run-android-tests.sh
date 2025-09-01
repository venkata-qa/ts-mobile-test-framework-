#!/usr/bin/env bash

# Set environment variables
export APPIUM_URL="http://localhost:4723"
export TEST_ENV="qa"

# Run the tests with the environment variables set
npm run build && npm run test:android
