# Mobile Test Framework

A TypeScript-based mobile testing framework using WebdriverIO, Appium, and Cucumber.

## Overview

This framework allows you to run automated tests on both:
1. Local Android and iOS devices/emulators
2. BrowserStack cloud testing platform

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Appium Server v2.x (for local testing)
- Android SDK and/or Xcode (for local testing)
- BrowserStack account (for cloud testing)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

### Local Testing

For local testing, make sure:
1. Appium server is running on http://localhost:4723
2. Android emulator or iOS simulator is available and running

### BrowserStack Testing

For BrowserStack testing:
1. Create a `.env` file in the root directory with the following:
```properties
# BrowserStack Credentials
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key

# BrowserStack App IDs
BROWSERSTACK_ANDROID_APP_ID=bs://your_android_app_id
BROWSERSTACK_IOS_APP_ID=bs://your_ios_app_id
```

2. Upload your app to BrowserStack and get the app ID

## Running Tests

### Local Android Tests

```bash
cd scripts
./run-tests.sh --platform android --env local
```

### Local iOS Tests

```bash
cd scripts
./run-tests.sh --platform ios --env local
```

### BrowserStack Android Tests

```bash
./scripts/run-browserstack-tests.sh android
```

### BrowserStack iOS Tests

```bash
./scripts/run-browserstack-tests.sh ios
```

## Test Structure

- **Features**: Located in `src/test/features/mobile`
- **Step Definitions**: Located in `src/test/steps/mobile`
- **Page Objects**: Located in `src/test/ui/pageObjects`
- **Support Files**: Located in `src/test/support`

## Reports

After running tests, reports are generated in:
- Cucumber JSON: `reports/cucumber-report.json`
- Allure Report: `allure-report/` (open `index.html`)

To generate an Allure report after a test run:
```bash
npx allure generate --clean
```

## Troubleshooting

### Common Issues

1. **Connection Refused to Appium**
   - Ensure Appium server is running on the correct port (4723)
   - Check that the URL is correctly formatted

2. **Device Not Found**
   - For Android: Verify emulator is running with `adb devices`
   - For iOS: Verify simulator is running with `xcrun simctl list`

3. **BrowserStack Connection Issues**
   - Verify credentials in `.env` file
   - Check app ID is correct and the app is uploaded to BrowserStack

4. **Missing Page Objects**
   - Ensure all page objects are properly exported and available in the page object directory

### Logs

Check the logs for detailed error information:
- `logs/test.log`: Contains framework logs
- `allure-results/`: Contains test execution details

## Advanced Configuration

### Device Configuration

Modify the device configurations in:
- Local Android: `config/default.json` or via environment variables
- Local iOS: `config/default.json` or via environment variables
- BrowserStack: Update the `.env` file and/or `scripts/run-browserstack-tests.sh`
