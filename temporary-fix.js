#!/usr/bin/env node

// temporary-fix.js
// This script directly modifies the JavaScript output to force the iOS platformVersion
// to match the available SDK version.

const fs = require('fs');
const path = require('path');

// Path to the compiled IOSDriver.js file
const iosDriverPath = path.join(__dirname, 'dist', 'core', 'driver', 'iosDriver.js');

try {
  // Read the file
  let fileContent = fs.readFileSync(iosDriverPath, 'utf8');
  
  // Replace '15.0' with '18.6' in all occurrences
  fileContent = fileContent.replace(/'platformVersion':\s*'15.0'/g, "'platformVersion': '18.6'");
  fileContent = fileContent.replace(/'appium:platformVersion':\s*'15.0'/g, "'appium:platformVersion': '18.6'");
  fileContent = fileContent.replace(/'deviceName':\s*'iPhone Simulator'/g, "'deviceName': 'iPhone 16 Plus'");
  fileContent = fileContent.replace(/'appium:deviceName':\s*'iPhone Simulator'/g, "'appium:deviceName': 'iPhone 16 Plus'");
  
  // Add the UDID
  const udidPattern = /const baseCapabilities = {([^}]+)}/;
  fileContent = fileContent.replace(
    udidPattern,
    "const baseCapabilities = {$1, 'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91'}"
  );
  
  // Write the modified content back
  fs.writeFileSync(iosDriverPath, fileContent);
  
  console.log('Successfully updated iOS driver capabilities to use SDK 18.6');
} catch (error) {
  console.error('Error modifying iOS driver file:', error);
  process.exit(1);
}
