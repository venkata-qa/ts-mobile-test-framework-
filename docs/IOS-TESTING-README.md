# iOS Testing Solution

## Background
This project contains a mobile testing framework for Android and iOS applications using WebdriverIO, Appium, and Cucumber.js. While the Android tests work correctly through the framework, we encountered challenges with iOS simulator testing due to incompatibility between the framework's configuration and the available iOS simulator SDK.

## Issue
The framework was configured to use iOS SDK 15.0, but the system only has iOS SDK 18.6 available. When running tests through Cucumber, Appium attempts to create an iPhone X simulator with the iOS 18.6 SDK, which fails.

## Solution
We've implemented two approaches for iOS testing:

### 1. Direct Test Approach (Working)
The `ios-direct-test.js` script provides a direct WebdriverIO implementation that works correctly with the available iPhone 16 Plus simulator. This script:
- Uses the exact iOS simulator that is already running on the system
- Connects directly to Appium with the correct capabilities
- Performs the login test successfully
- Verifies that the user can successfully log in to the app

To run the direct iOS test:
```bash
./run-ios-direct.sh
```

This approach bypasses the framework's configuration layers that are causing issues and directly uses WebdriverIO to connect to Appium.

### 2. Framework Integration (In Progress)
We've made several attempts to fix the framework configuration to work with the iOS 18.6 SDK:
- Updated IOSDriver.ts with the correct simulator information
- Created fix scripts to modify compiled JavaScript files
- Added additional capabilities to prevent Appium from creating new simulators

However, the framework continues to try to create a new iPhone X simulator instead of using the existing iPhone 16 Plus simulator.

## Next Steps
To fully integrate iOS testing into the framework, we recommend:

1. Modify the framework code to specify the exact UDID of the existing simulator in all places
2. Update the IOSDriver.ts and DriverFactory.ts classes to use the exact iOS 18.6 simulator configurations
3. Add a `skipDeviceInstallation: true` capability to prevent Appium from trying to create a new simulator
4. Consider using Appium's `useNewWDA: false` and `noReset: true` options for better stability

## Usage
For now, use the direct test approach for iOS testing and the framework for Android testing.

1. Run Android tests via the framework:
```bash
npm run build && ./scripts/run-android-demo-test.sh
```

2. Run iOS tests directly:
```bash
./run-ios-direct.sh
```
