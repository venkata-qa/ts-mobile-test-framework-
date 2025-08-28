// fix-ios-simulator.js
const fs = require('fs');
const path = require('path');

// Function to fix iOS driver
function fixIOSDriver() {
  console.log('Fixing iOS driver in compiled JavaScript...');
  
  // Path to compiled iosDriver.js
  const iosDriverPath = path.join(__dirname, 'dist/core/driver/iosDriver.js');
  
  try {
    let content = fs.readFileSync(iosDriverPath, 'utf8');
    
    // First check if file has been already fixed
    if (content.includes('shouldUseSingletonTestManager')) {
      console.log('iOS driver already fixed, skipping...');
      return;
    }
    
    // Fix object syntax issues in the compiled JS
    // Find the capabilities object
    const capObjStart = content.indexOf('const overrideCapabilities = {');
    if (capObjStart === -1) {
      console.log('Could not find capabilities object, skipping...');
      return;
    }
    
    // Get the content from the start of the file to the capabilities object
    const beforeCap = content.substring(0, capObjStart);
    
    // Create a corrected capabilities object
    const correctCap = `const overrideCapabilities = {
                'appium:deviceName': 'iPhone 16 Plus',
                'appium:platformVersion': '18.6',
                'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91',
                'appium:app': '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app',
                'appium:noNewCommandTimeout': true,
                'appium:showXcodeLog': true,
                'appium:usePrebuiltWDA': false,
                'appium:shouldUseSingletonTestManager': false,
                'appium:shouldTerminateApp': true,
                'appium:forceAppLaunch': true
            };`;
    
    // Find the end of the capabilities object
    const capObjEnd = content.indexOf('};', capObjStart) + 2;
    
    // Get the content after the capabilities object
    const afterCap = content.substring(capObjEnd);
    
    // Combine all parts
    const newContent = beforeCap + correctCap + afterCap;
    
    // Write the fixed content back to the file
    fs.writeFileSync(iosDriverPath, newContent, 'utf8');
    console.log('iOS driver fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing iOS driver:', error);
  }
}

// Also fix the mobile.config.json file to make sure it uses the right simulator
function fixMobileConfig() {
  console.log('Updating mobile config...');
  
  const configPath = path.join(__dirname, 'src/test/resources/config/mobile.config.json');
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    if (config.ios) {
      config.ios.deviceName = 'iPhone 16 Plus';
      config.ios.platformVersion = '18.6';
      config.ios.udid = 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91';
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
      console.log('Mobile config updated successfully!');
    } else {
      console.log('No iOS configuration found in mobile.config.json');
    }
  } catch (error) {
    console.error('Error updating mobile config:', error);
  }
}

// Also fix qa.json config
function fixQAConfig() {
  console.log('Updating QA config...');
  
  const configPath = path.join(__dirname, 'config/qa.json');
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    if (config.ios) {
      config.ios.deviceName = 'iPhone 16 Plus';
      config.ios.platformVersion = '18.6';
      config.ios.udid = 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91';
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
      console.log('QA config updated successfully!');
    } else {
      console.log('No iOS configuration found in qa.json');
    }
  } catch (error) {
    console.error('Error updating QA config:', error);
  }
}

// Fix the DriverFactory.js file
function fixDriverFactory() {
  console.log('Fixing DriverFactory.js...');
  
  const driverFactoryPath = path.join(__dirname, 'dist/core/driver/driverFactory.js');
  
  try {
    let content = fs.readFileSync(driverFactoryPath, 'utf8');
    
    // Add additional iOS capabilities
    const iosCapabilitiesSection = content.indexOf("if (targetPlatform.toLowerCase() === 'ios') {");
    if (iosCapabilitiesSection !== -1) {
      // Find where the current iOS capabilities end
      const capEndIndex = content.indexOf("this.logger.info('Overriding iOS capabilities to use SDK 18.6');", iosCapabilitiesSection);
      if (capEndIndex !== -1) {
        const beforeCap = content.substring(0, iosCapabilitiesSection);
        const afterCapEnd = content.substring(capEndIndex);
        
        const newCapabilities = `if (targetPlatform.toLowerCase() === 'ios') {
            capabilities['appium:platformVersion'] = '18.6';
            capabilities['appium:deviceName'] = 'iPhone 16 Plus';
            capabilities['appium:udid'] = 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91';
            capabilities['appium:app'] = '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app';
            capabilities['appium:noNewCommandTimeout'] = true;
            capabilities['appium:showXcodeLog'] = true;
            capabilities['appium:usePrebuiltWDA'] = false;
            capabilities['appium:shouldUseSingletonTestManager'] = false;
            capabilities['appium:shouldTerminateApp'] = true;
            capabilities['appium:forceAppLaunch'] = true;`;
        
        const newContent = beforeCap + newCapabilities + afterCapEnd;
        fs.writeFileSync(driverFactoryPath, newContent, 'utf8');
        console.log('DriverFactory.js fixed successfully!');
      } else {
        console.log('Could not find end of iOS capabilities section in DriverFactory.js');
      }
    } else {
      console.log('Could not find iOS capabilities section in DriverFactory.js');
    }
  } catch (error) {
    console.error('Error fixing DriverFactory.js:', error);
  }
}

// Run all fixes
fixIOSDriver();
fixDriverFactory();
fixMobileConfig();
fixQAConfig();
