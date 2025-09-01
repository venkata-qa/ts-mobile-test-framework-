# Mobile Test Framework Setup Guide

This document provides detailed instructions for setting up and running the TypeScript mobile test framework with Appium on a new machine. Follow these steps in sequence to ensure proper configuration.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Project Setup](#project-setup)
4. [iOS Test Configuration](#ios-test-configuration)
5. [Android Test Configuration](#android-test-configuration)
6. [Running Tests](#running-tests)
7. [Allure Reporting](#allure-reporting)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure your system has the following software installed:

- **Node.js**: v16.x or later
  - Check with: `node -v`
  - Install: [https://nodejs.org/](https://nodejs.org/)

- **npm**: v8.x or later
  - Check with: `npm -v`
  - Comes with Node.js

- **Appium**: v3.0.0 or later
  - Check with: `appium --version`
  - Install: `npm install -g appium@3.0.1`

- **Git**: Latest version
  - Check with: `git --version`
  - Install: [https://git-scm.com/downloads](https://git-scm.com/downloads)

- **TypeScript**: v4.x or later
  - Check with: `tsc -v`
  - Install: `npm install -g typescript`

- **Allure Command-line Tools**: Latest version
  - Check with: `allure --version`
  - Install: 
    - macOS: `brew install allure`
    - Windows: `scoop install allure`
    - Linux: `sudo apt-add-repository ppa:qameta/allure && sudo apt-get update && sudo apt-get install allure`

## Environment Setup

### macOS Setup

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Java Development Kit (JDK)**:
   ```bash
   brew install openjdk@17
   ```

3. **Install iOS Dependencies**:
   ```bash
   brew install ios-deploy
   brew install carthage
   brew install ideviceinstaller
   brew install libimobiledevice
   ```

4. **Install Xcode** from the App Store
   - Open Xcode and accept license agreement
   - Install command-line tools: `xcode-select --install`

5. **Install Appium and Drivers**:
   ```bash
   npm install -g appium@3.0.1
   appium driver install xcuitest
   appium driver install uiautomator2
   ```

6. **Verify Appium Setup**:
   ```bash
   appium --use-drivers=xcuitest
   ```

### Windows Setup

1. **Install JDK 17**:
   - Download from [Oracle](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
   - Add JAVA_HOME to environment variables

2. **Install Android Studio**:
   - Download from [Android Studio](https://developer.android.com/studio)
   - Add ANDROID_HOME to environment variables
   - Add platform-tools and tools to PATH

3. **Install Appium and Drivers**:
   ```bash
   npm install -g appium@3.0.1
   appium driver install uiautomator2
   ```

4. **Verify Appium Setup**:
   ```bash
   appium --use-drivers=uiautomator2
   ```

## Project Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd ts-mobile-test-framework
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Project**:
   ```bash
   npm run build
   ```

4. **Configure Environment**:
   - Copy example configuration files and modify as needed
   ```bash
   cp src/config/example.config.ts src/config/local.config.ts
   ```
   - Update device capabilities in `src/config/capabilities/` directory

## iOS Test Configuration

1. **iOS Simulator Setup**:
   - Open Xcode > Preferences > Components
   - Install iOS simulators (iOS 15.0 or later recommended)

2. **Get Device UDID**:
   ```bash
   xcrun simctl list | grep -i iphone
   ```

3. **Update iOS Capabilities**:
   - Edit `src/config/capabilities/ios.ts` with your device info:
   ```typescript
   export const iosCapabilities = {
     platformName: 'iOS',
     'appium:deviceName': 'iPhone 13',
     'appium:platformVersion': '15.5',
     'appium:automationName': 'XCUITest',
     'appium:app': '/absolute/path/to/app/file.app',
     'appium:udid': '<your-simulator-udid>'
   };
   ```

4. **Install Test App**:
   - Place your .app or .ipa file in the `src/test/resources/app` directory
   - Update the path in your capabilities file

## Android Test Configuration

1. **Create Android Virtual Device (AVD)**:
   - Open Android Studio > AVD Manager
   - Create a virtual device with API level 30+ (Android 11+)

2. **Get Device UDID**:
   ```bash
   adb devices
   ```

3. **Update Android Capabilities**:
   - Edit `src/config/capabilities/android.ts`:
   ```typescript
   export const androidCapabilities = {
     platformName: 'Android',
     'appium:deviceName': 'Pixel_5',
     'appium:platformVersion': '12',
     'appium:automationName': 'UiAutomator2',
     'appium:app': '/absolute/path/to/app/file.apk',
     'appium:udid': '<your-emulator-udid>'
   };
   ```

4. **Install Test App**:
   - Place your .apk file in the `src/test/resources/app` directory
   - Update the path in your capabilities file

## Running Tests

### Start Appium Server

```bash
# In a separate terminal window/tab
appium --use-drivers=xcuitest,uiautomator2
```

### Run iOS Tests

```bash
# Run basic iOS tests
npm run test:ios

# Run iOS tests with Allure reporting
npm run test:ios:allure
```

### Run Android Tests

```bash
# Run basic Android tests
npm run test:android

# Run Android tests with Allure reporting
npm run test:android:allure
```

### Run Specific Tests

```bash
# Run a specific feature file
npm run cucumber -- --tags @login

# Run tests with specific tags
npm run cucumber -- --tags "@smoke and @ios"
```

## Allure Reporting

1. **Generate Allure Report**:
   ```bash
   # After running tests with Allure (test:ios:allure or test:android:allure)
   allure generate allure-results -o allure-report --clean
   ```

2. **Open Allure Report**:
   ```bash
   allure open allure-report
   ```

3. **Report Features**:
   - Test case status and history
   - Screenshots of failures
   - Step-by-step execution details
   - Environment information
   - Test categorization

## Troubleshooting

### Common Issues and Solutions

1. **"Invalid URL" Error with Appium**:
   - Ensure Appium server is running
   - Check server URL and port in config files
   - Verify network connections

2. **Device Not Found**:
   - For iOS: Check UDID with `xcrun simctl list`
   - For Android: Check device with `adb devices`
   - Update capabilities file with correct UDID

3. **App Installation Failed**:
   - Verify app path is correct and absolute
   - Check app is compatible with the OS version
   - For iOS: Ensure app is properly signed or is a simulator build

4. **Element Not Found Errors**:
   - Update locator strategies in page objects
   - Increase implicit wait timeout
   - Add explicit waits for dynamic elements

5. **Screenshot Not Attached to Reports**:
   - Check file permissions in reports directory
   - Verify screenshot capture method in world.ts
   - Run with sudo if needed for file system access

### Logs and Debugging

1. **Enable Verbose Logging**:
   - Set log level in config.ts: `logLevel: 'debug'`
   - Check logs in the `/logs` directory

2. **Appium Server Logs**:
   - Run Appium with increased verbosity:
   ```bash
   appium --use-drivers=xcuitest,uiautomator2 --log-level debug
   ```

3. **WebdriverIO Logs**:
   - Set WebdriverIO log level in capabilities:
   ```typescript
   'appium:webdriverLogLevel': 'debug'
   ```

## Contact and Support

For additional help or questions, contact the framework maintainers:
- [Team Email](mailto:mobile-test-framework@example.com)
- [Internal Documentation](https://wiki.example.com/mobile-testing)
- [GitHub Repository](https://github.com/example/mobile-test-framework)
