#!/usr/bin/env node
/**
 * iOS Demo Test Runner
 * 
 * This script runs the iOS demo tests using our direct-ios-driver approach
 * that bypasses the framework's configuration issues.
 */

const { execSync } = require('child_process');
const { createIOSDriver } = require('./direct-ios-driver');
const cucumber = require('@cucumber/cucumber');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = 'qa';
process.env.TEST_ENV = 'qa'; 
process.env.PLATFORM = 'ios';
process.env.APPIUM_URL = 'http://localhost:4723';

// Print debug information
console.log('Environment variables:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`TEST_ENV: ${process.TEST_ENV}`);
console.log(`PLATFORM: ${process.env.PLATFORM}`);
console.log(`APPIUM_URL: ${process.env.APPIUM_URL}`);

console.log('\nRunning iOS demo tests with direct driver...');

// Add global driver to be accessed in steps
global.__directIOSDriver = null;

// Override the TestWorld's initMobileDriver method in hooks.js
require('./dist/test/support/hooks');
const hooks = require('./dist/test/support/hooks');

// Store original before function
const originalBefore = hooks.before;

// Override the before hook
hooks.before = function(scenario) {
  console.log('Using direct iOS driver for testing...');
  
  // Create driver using our direct approach
  return createIOSDriver().then(driver => {
    global.__directIOSDriver = driver;
    
    // Set the driver on the world object so steps can access it
    this.driver = global.__directIOSDriver;
    
    console.log('Direct iOS driver successfully initialized');
  }).catch(error => {
    console.error('Failed to initialize direct iOS driver:', error);
    throw error;
  });
};

// Store original after function
const originalAfter = hooks.after;

// Override the after hook to clean up our direct driver
hooks.after = async function(scenario) {
  try {
    if (global.__directIOSDriver) {
      console.log('Cleaning up direct iOS driver...');
      await global.__directIOSDriver.deleteSession();
      global.__directIOSDriver = null;
    }
  } catch (error) {
    console.error('Error cleaning up direct iOS driver:', error);
  }
  
  // Call original after hook
  return originalAfter.call(this, scenario);
};

// Run Cucumber with the iOS profile
const args = [
  '--profile', 'ios',
  '--format', 'progress',
  '--format', 'json:reports/ios-report.json'
];

// Run Cucumber programmatically
const cli = new cucumber.Cli({
  argv: ['node', 'cucumber-js', ...args],
  cwd: process.cwd(),
  stdout: process.stdout
});

cli.run()
  .then((success) => {
    const exitCode = success ? 0 : 1;
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error('Error running Cucumber tests:', error);
    process.exit(1);
  });
