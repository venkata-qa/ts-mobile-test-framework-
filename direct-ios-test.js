#!/usr/bin/env node

// direct-ios-test.js
// This script bypasses the framework and creates a WebdriverIO session directly
// with the correct capabilities for our iOS simulator.

const { remote } = require('webdriverio');

async function runTest() {
  console.log('Starting direct iOS test...');
  
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
  
  try {
    console.log('Creating WebdriverIO session with capabilities:', JSON.stringify(capabilities, null, 2));
    
    const driver = await remote({
      logLevel: 'info',
      hostname: 'localhost',
      port: 4723,
      path: '/',
      capabilities
    });
    
    console.log('Session created successfully!');
    
    // Wait a bit to make sure the app is launched
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find username field and type username
    console.log('Typing username...');
    const usernameField = await driver.$('~test-Username');
    await usernameField.setValue('standard_user');
    
    // Find password field and type password
    console.log('Typing password...');
    const passwordField = await driver.$('~test-Password');
    await passwordField.setValue('secret_sauce');
    
    // Tap login button
    console.log('Tapping login button...');
    const loginButton = await driver.$('~test-LOGIN');
    await loginButton.click();
    
    // Wait for products page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify that we're on the products page
    console.log('Checking if we navigated to products page...');
    try {
      // Get page source to debug available elements
      const source = await driver.getPageSource();
      console.log('Page source:', source.substring(0, 500) + '...');
      
      // Try multiple selectors that might be on the products page
      let productPageElement;
      try {
        productPageElement = await driver.$('~test-PRODUCTS');
        console.log('Found products header');
      } catch (e) {
        try {
          productPageElement = await driver.$('~test-Cart');
          console.log('Found cart button');
        } catch (e) {
          try {
            productPageElement = await driver.$('~test-Menu');
            console.log('Found menu button');
          } catch (e) {
            console.log('No known products page elements found');
          }
        }
      }
      
      if (productPageElement) {
        const isVisible = await productPageElement.isDisplayed();
        console.log('Product page element visible:', isVisible);
        if (isVisible) {
          console.log('✅ TEST PASSED: Successfully logged in!');
        } else {
          console.log('❌ TEST FAILED: Product page element not visible');
        }
      } else {
        console.log('❌ TEST FAILED: Could not find any product page elements');
      }
    } catch (err) {
      console.log('❌ TEST FAILED: Error checking product page -', err.message);
    }
    
    // Close session
    console.log('Closing session...');
    await driver.deleteSession();
    console.log('Test completed!');
    
  } catch (err) {
    console.error('Error running test:', err);
    process.exit(1);
  }
}

runTest();
