#!/usr/bin/env node

// fix-ios-config.js
// This script makes direct changes to the compiled JavaScript to ensure
// the correct iOS simulator configuration is used

const fs = require('fs');
const path = require('path');

console.log('Fixing iOS configurations in compiled JavaScript files...');

// Path to various compiled JavaScript files
const paths = [
  path.join(__dirname, 'dist', 'core', 'driver', 'iosDriver.js'),
  path.join(__dirname, 'dist', 'core', 'driver', 'driverFactory.js'),
  path.join(__dirname, 'dist', 'test', 'support', 'world.js')
];

// Configuration values to force
const config = {
  deviceName: 'iPhone 16 Plus',
  platformVersion: '18.6',
  udid: 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91',
  appPath: '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app'
};

// Process each file
paths.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`Processing: ${filePath}`);
    
    try {
      // Read the file
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace platform version - this handles both normal and prefixed appium: versions
      content = content.replace(/(['"])(?:appium:)?platformVersion(?:['"]):\s*(['"])[\d\.]+(['"])/g, 
                               `$1$2${config.platformVersion}$3`);
      
      // Replace device name - this handles both normal and prefixed appium: versions
      content = content.replace(/(['"])(?:appium:)?deviceName(?:['"]):\s*(['"])[^'"]+(['"])/g, 
                               `$1$2${config.deviceName}$3`);
      
      // Replace UDID if present
      content = content.replace(/(['"])(?:appium:)?udid(?:['"]):\s*(['"])[^'"]+(['"])/g, 
                               `$1$2${config.udid}$3`);
      
      // Replace app path if present
      content = content.replace(/(['"])(?:appium:)?app(?:['"]):\s*(['"])[^'"]+(['"])/g, 
                               `$1$2${config.appPath}$3`);
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Successfully updated ${filePath}`);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('iOS configuration update completed!');
