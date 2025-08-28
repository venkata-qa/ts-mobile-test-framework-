# iOS Testing Guide

## Overview

This guide explains how to run iOS tests using our TypeScript mobile test framework with Appium and WebDriverIO.

## Prerequisites

- macOS with Xcode installed
- Node.js (v16+)
- Appium 3.0.1+
- XCUITest driver for Appium
- iOS Simulator configured

## Setup

1. Install Node.js dependencies:

```bash
npm install
```

2. Start the Appium server:

```bash
./scripts/start-appium-ios.sh
```

3. Run iOS tests:

```bash
./scripts/run-ios-cucumber-test.sh
```

4. Run iOS tests with Allure reporting:

```bash
./scripts/run-ios-tests-with-allure.sh
```

## Framework Structure

The iOS testing implementation uses:

- **IOSHooks.ts**: Contains specialized hooks for iOS test initialization with specific simulator details
- **IOSDriver.ts**: Creates and manages iOS driver sessions
- **world.ts**: Contains the `initIOSDriverDirect` method for direct iOS driver initialization
- **cucumber.js**: Configuration for iOS test profiles

## Important Notes

1. **Using Specific Simulator**

   Tests are configured to use a specific iOS simulator with exact UDID. This approach avoids the "Could not create simulator" error that occurs when Appium tries to create new simulators.

   ```typescript
   const capabilities = {
     platformName: 'iOS',
     'appium:deviceName': 'iPhone 16 Plus',
     'appium:platformVersion': '18.6',
     'appium:automationName': 'XCUITest',
     'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91',
     // other capabilities...
   };
   ```

2. **Feature Files**

   iOS features should use the `@ios` or `@iosdemo` tags to ensure proper hooks are triggered.

   ```gherkin
   @iosdemo
   Feature: SauceLabs Demo App Login on iOS
     # feature content...
   ```

3. **Page Objects**

   Use accessibility IDs (`~test-ElementName`) for selectors to ensure compatibility across both iOS and Android.

## Troubleshooting

- **Session Creation Errors**: Verify that the simulator UDID is correct and the simulator is available
- **Element Not Found Errors**: Verify accessibility IDs match between iOS and Android apps
- **Appium Connection Issues**: Ensure Appium is running with proper permissions (`--relaxed-security`)

## Creating New iOS Tests

1. Create a feature file with the `@ios` tag
2. Implement step definitions if needed (most mobile steps work for both platforms)
3. Create iOS-specific page objects if needed
4. Run tests using the `run-ios-cucumber-test.sh` script

## Common Commands

- List available simulators: `xcrun simctl list devices`
- Reset Appium: `npm run appium:reset`
- Run specific iOS feature: `npx cucumber-js -p ios src/test/features/mobile/your-feature.feature`
- Generate Allure report: `npm run report`

## Allure Reporting

Our iOS tests include comprehensive Allure reporting features:

### Key Features

- **Screenshot Capture**: Automatic screenshots on test failures
- **Device Information**: iOS simulator details and Appium capabilities
- **Execution Timeline**: Visual timeline of test execution
- **Environment Data**: Test environment information
- **Categorized Failures**: Issues categorized by type for easier debugging

### Viewing Reports

After running tests with the Allure script, the report will automatically open in your browser. You can also manually generate and view reports:

```bash
npm run report
```

### Report Location

- Allure results: `./allure-results/`
- Generated report: `./allure-report/`
