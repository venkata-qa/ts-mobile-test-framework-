# Quick-Start Guide: Running Tests with Allure Reporting

This guide provides a concise set of steps to quickly get the mobile test framework running with Allure reporting on a new machine.

## Prerequisites Checklist

- [ ] Node.js v16+ and npm v8+
- [ ] Appium 3.0.1 with xcuitest and/or uiautomator2 drivers
- [ ] JDK 17 or later
- [ ] Xcode (for iOS testing) or Android Studio (for Android testing)
- [ ] Allure command-line tools

## 1. Install Essential Software

### macOS
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@16

# Install Appium and drivers
npm install -g appium@3.0.1
appium driver install xcuitest
appium driver install uiautomator2

# Install Allure
brew install allure
```

### Windows
```bash
# Using Chocolatey package manager
choco install nodejs-lts
choco install openjdk17
choco install allure-commandline

# Install Appium and drivers
npm install -g appium@3.0.1
appium driver install xcuitest
appium driver install uiautomator2
```

## 2. Clone and Setup Project

```bash
# Clone repository
git clone <repository-url>
cd ts-mobile-test-framework

# Install dependencies
npm install

# Build the project
npm run build
```

## 3. Configure Test Devices

### iOS Testing
Edit `src/config/capabilities/ios.ts` with your device information:

```typescript
export const iosCapabilities = {
  platformName: 'iOS',
  'appium:deviceName': 'iPhone 16 Plus', // Use your device name
  'appium:platformVersion': '18.6',      // Use your iOS version
  'appium:automationName': 'XCUITest',
  'appium:app': '/absolute/path/to/app', // Update with app path
  'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91' // Your UDID
};
```

Get your simulator UDID with: `xcrun simctl list`

### Android Testing
Edit `src/config/capabilities/android.ts`:

```typescript
export const androidCapabilities = {
  platformName: 'Android',
  'appium:deviceName': 'Pixel_5',       // Use your device name
  'appium:platformVersion': '13',       // Use your Android version
  'appium:automationName': 'UiAutomator2',
  'appium:app': '/absolute/path/to/app.apk', // Update with app path
  'appium:udid': 'emulator-5554'        // Your emulator/device ID
};
```

Get your device ID with: `adb devices`

## 4. Start Appium Server

Open a terminal window and start Appium:

```bash
appium --use-drivers=xcuitest,uiautomator2
```

Keep this terminal window open while running tests.

## 5. Run Tests with Allure Reporting

### iOS Tests
```bash
# Make sure script is executable
chmod +x ./scripts/run-ios-tests-with-allure.sh

# Run iOS tests with Allure reporting
npm run test:ios:allure
```

### Android Tests
```bash
# Make sure script is executable
chmod +x ./scripts/run-android-tests-with-allure.sh

# Run Android tests with Allure reporting
npm run test:android:allure
```

## 6. Generate and View Allure Reports

```bash
# Generate Allure report from results
allure generate allure-results -o allure-report --clean

# Open the report in your browser
allure open allure-report
```

## 7. Common Issues

### Appium Connection Issues
- Check Appium is running with `appium --use-drivers=xcuitest,uiautomator2`
- Verify device is connected/available
- Check device UDID is correct in capabilities

### Screenshot Issues in Allure
- Verify screenshot capture in `src/test/support/world.ts`
- Check file permissions in allure-results directory

### App Installation Problems
- Verify absolute path to the app in capabilities file
- Make sure app is compatible with target OS version

## 8. Quick Commands Reference

```bash
# Start Appium
appium --use-drivers=xcuitest,uiautomator2

# Build the project
npm run build

# Run iOS tests with Allure
npm run test:ios:allure

# Run Android tests with Allure
npm run test:android:allure

# Generate & view report
allure generate allure-results -o allure-report --clean
allure open allure-report
```

For more detailed setup instructions, refer to the [SETUP.md](./SETUP.md) document.
