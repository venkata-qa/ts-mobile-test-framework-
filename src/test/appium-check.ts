import { remote } from 'webdriverio';

async function checkAppiumConnection() {
  console.log('Checking Appium connection...');
  
  try {
    const appiumUrl = 'http://localhost:4723';
    console.log(`Using Appium URL: ${appiumUrl}`);
    
    const capabilities = {
      platformName: 'Android',
      'appium:deviceName': 'Pixel 3',
      'appium:platformVersion': '16', // Updated to match available emulator version
      'appium:automationName': 'UiAutomator2',
      'appium:app': '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/Android.SauceLabs.Mobile.Sample.app.2.7.1.apk',
      'appium:appActivity': 'com.swaglabsmobileapp.MainActivity', // Added appActivity
      'appium:appPackage': 'com.swaglabsmobileapp', // Added appPackage
      'appium:noReset': false,
      'appium:newCommandTimeout': 180
    };
    
    // For Appium 3.0, the path has changed - no more /wd/hub
    const options = {
      logLevel: 'info' as 'info',
      capabilities,
      hostname: 'localhost',
      port: 4723,
      path: '/' // Changed from '/wd/hub' to '/' for Appium 3.x
    };
    
    console.log('Initializing driver with capabilities:', JSON.stringify(capabilities, null, 2));
    
    const driver = await remote(options);
    console.log('Driver initialized successfully!');
    
    // Quick test to see if we can interact with the app
    await driver.pause(3000);
    console.log('App is running');
    
    // Clean up
    await driver.deleteSession();
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error connecting to Appium:', error);
  }
}

checkAppiumConnection();
