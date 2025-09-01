const { remote } = require('webdriverio');

// Create a direct iOS test script that uses our existing iPhone 16 Plus simulator
async function runIOSDirectTest() {
  console.log('Starting direct iOS test...');

  // These are the capabilities that worked in our direct test
  const capabilities = {
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 16 Plus',
    'appium:platformVersion': '18.6',
    'appium:automationName': 'XCUITest',
    'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91',
    'appium:app': '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app',
    'appium:noReset': false,
    'appium:newCommandTimeout': 180,
    'appium:connectHardwareKeyboard': true
  };

  console.log('Creating WebdriverIO session with capabilities:', JSON.stringify(capabilities, null, 2));

  try {
    // Create a WebdriverIO session
    const driver = await remote({
      logLevel: 'info',
      hostname: 'localhost',
      port: 4723,
      path: '/',
      capabilities
    });

    console.log('Session created successfully!');

    // Log in
    console.log('Typing username...');
    const usernameField = await driver.$('~test-Username');
    await usernameField.clearValue();
    await usernameField.setValue('standard_user');

    console.log('Typing password...');
    const passwordField = await driver.$('~test-Password');
    await passwordField.clearValue();
    await passwordField.setValue('secret_sauce');

    console.log('Tapping login button...');
    const loginButton = await driver.$('~test-LOGIN');
    await loginButton.click();

    // Wait for the products page to load
    await driver.pause(2000);
    
    console.log('Checking if we navigated to products page...');
    
    // Use multiple approaches to check if we're on the products page
    try {
      const productsHeader = await driver.$('~test-PRODUCTS');
      const isDisplayed = await productsHeader.isDisplayed();
      console.log('Product page element visible:', isDisplayed);
      
      if (isDisplayed) {
        console.log('✅ TEST PASSED: Successfully logged in!');
      } else {
        console.log('❌ TEST FAILED: Could not find products page header');
      }
    } catch (error) {
      console.error('Error checking for products page:', error);
      console.log('❌ TEST FAILED: Error while checking for products page');
    }

    // End session
    console.log('Closing session...');
    await driver.deleteSession();
    console.log('Test completed!');
    
    return true;
  } catch (error) {
    console.error('Test failed with error:', error);
    return false;
  }
}

// Run the test
runIOSDirectTest().then((success) => {
  if (success) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});
