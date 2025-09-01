# TypeScript Mobile Test Framework - Scripts

This directory contains essential scripts for running mobile and API tests locally or on BrowserStack.

## Available Scripts

### Mobile Tests

- `run-tests.sh` - Universal script to run Android/iOS tests locally or on BrowserStack

  **Usage:**
  ```bash
  # Run with default settings (Android, local, @smoke tags)
  ./scripts/run-tests.sh
  
  # Run with custom parameters
  ./scripts/run-tests.sh --platform [android|ios] --env [local|browserstack] --tags "@yourTag"
  ```

  **Examples:**
  ```bash
  # Run Android tests locally with @smoke tag
  ./scripts/run-tests.sh --platform android --env local --tags "@smoke"
  
  # Run iOS tests on BrowserStack with @regression tag
  ./scripts/run-tests.sh --platform ios --env browserstack --tags "@regression"
  ```

### API Tests

- `run-api-tests.sh` - Script to run API tests

  **Usage:**
  ```bash
  # Run all API tests
  ./scripts/run-api-tests.sh
  
  # Run specific API tests by tag
  ./scripts/run-api-tests.sh "@api-login"
  ```

### Utilities

- `start-appium.sh` - Starts the Appium server for local mobile testing

  **Usage:**
  ```bash
  # Start Appium server in background
  ./scripts/start-appium.sh
  ```

## Using via npm Scripts

For convenience, you can also use the npm scripts defined in `package.json`:

```bash
# Start Appium for local testing
npm run start:appium

# Run Android tests locally
npm run test:android

# Run iOS tests locally
npm run test:ios

# Run Android tests on BrowserStack
npm run test:android:browserstack

# Run iOS tests on BrowserStack
npm run test:ios:browserstack

# Run API tests
npm run test:api
```

## BrowserStack Configuration

For BrowserStack tests, set the following environment variables:

```bash
export BROWSERSTACK_USERNAME="your-username"
export BROWSERSTACK_ACCESS_KEY="your-access-key"
export BROWSERSTACK_APP_ID="bs://your-app-id"
```
