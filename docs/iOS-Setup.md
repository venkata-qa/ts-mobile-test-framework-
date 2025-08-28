# Instructions for Setting Up iOS Testing

## Prerequisites

To run iOS tests with this framework, you need the following:

1. **macOS Computer**: iOS testing can only be performed on macOS.

2. **Xcode installed**: You need Xcode with iOS simulators.
   - You can download from the Mac App Store or from [Apple Developer](https://developer.apple.com/xcode/)

3. **Appium XCUITest driver**: This is a plugin for Appium that enables iOS testing.
   ```bash
   appium driver install xcuitest
   ```

4. **iOS simulator**: You need an iOS simulator running (iPhone 13 with iOS 16 is configured).
   - Launch from Xcode > Open Developer Tool > Simulator
   - Or use command line: `xcrun simctl boot "iPhone 13"`

5. **SauceLabs Demo App**: Install the app in the simulator.
   - The app is located at: `/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app`
   - You can drag and drop it to the simulator or use command line:
   ```bash
   xcrun simctl install booted /Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app
   ```

## Running the Tests

Once everything is set up:

1. Make sure Appium server is running:
   ```bash
   appium
   ```

2. In a separate terminal, run the iOS demo test:
   ```bash
   ./run-ios-demo-test.sh
   ```

## Troubleshooting

If you encounter issues:

1. **XCUITest driver not found**: Make sure you've installed it with `appium driver install xcuitest`

2. **Cannot find simulator**: Make sure Xcode is installed and you've opened the simulator at least once

3. **App installation fails**: Check that the app path is correct and the app is compatible with the simulator's iOS version

4. **Configuration issues**: Look at the qa.json file in the config directory to verify iOS settings



open -a Simulator
xcrun simctl list devices
xcrun simctl boot "iPhone 15"





Fix in 5 steps

Install/verify full Xcode

Make sure Xcode is installed in /Applications (not just “Command Line Tools”).

Open Xcode once and accept any prompts.

Point the system to Xcode (not CommandLineTools)

xcode-select -p
# if you see /Library/Developer/CommandLineTools, switch to Xcode:
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
# (use Xcode-beta if that’s what you installed)


Accept license & ensure CLTs are present

sudo xcodebuild -license accept
xcode-select --install   # ok if it says “already installed”


Verify simctl is now visible

xcrun --find simctl
# should print: /Applications/Xcode.app/Contents/Developer/usr/bin/simctl
xcrun simctl list devices


(Optional) Launch Simulator & boot a device

open -a Simulator
xcrun simctl list devices
xcrun simctl boot "iPhone 15"   # pick a name from the list

If it still fails

You likely don’t have an iOS simulator runtime installed. Open Xcode → Settings → Platforms and install an iOS runtime (e.g., iOS 17.x). Then try xcrun simctl list devices again.

If you have multiple Xcodes installed, point to the one you want:

sudo xcode-select -s /Applications/Xcode-beta.app/Contents/Developer


Clear any odd state:

sudo xcode-select --reset
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
