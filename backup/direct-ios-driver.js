/**
 * This file creates a direct WebdriverIO session for iOS tests
 * It bypasses the framework's normal driver initialization process
 */
const { remote } = require('webdriverio');

/**
 * Creates a WebdriverIO session directly with the correct capabilities
 * for the iPhone 16 Plus simulator that's already booted
 */
function createIOSDriver() {
  console.log('Starting direct iOS driver with known working capabilities...');
  
  // Direct iOS capabilities based on our successful test
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
  
  // Options for WebdriverIO
  const options = {
    logLevel: 'info',
    capabilities,
    hostname: 'localhost',
    port: 4723,
    path: '/',
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3
  };
  
  console.log('Creating WebdriverIO session with capabilities:', JSON.stringify(capabilities, null, 2));
  
  return remote(options).then(driver => {
    console.log('WebdriverIO session created successfully!');
    
    // Set implicit timeout
    return driver.setTimeout({ implicit: 10000 }).then(() => {
      return driver;
    });
  }).catch(error => {
    console.error('Failed to create WebdriverIO session:', error);
    throw error;
  });
}

// Export the function
module.exports = {
  createIOSDriver
};
  try {
    console.log('Creating direct iOS driver with capabilities:', capabilities);
    const driver = await remote(options);
    await driver.setTimeout({ implicit: 10000 });
    console.log('iOS driver created successfully');
    return driver;
  } catch (error) {
    console.error('Failed to create iOS driver:', error);
    throw error;
  }
};
