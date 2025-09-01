import { Before } from '@cucumber/cucumber';
import { TestWorld } from './world';
import { Logger } from '../../core/utils/logger';
import * as fs from 'fs';
import * as path from 'path';

// Create logger for Android hooks
const logger = new Logger('AndroidHooks');

/**
 * Special hook for Android tests to ensure we use the correct emulator
 * This hook will override the default Android hook in hooks.ts
 */
Before({ tags: '@android or @androiddemo' }, async function(this: TestWorld) {
  logger.info('Starting Android scenario');
  
  // Determine if we're running on BrowserStack
  const isBrowserStack = process.env.APPIUM_URL?.includes('browserstack');
  const isLocal = !isBrowserStack;
  
  logger.info(`Running on: ${isBrowserStack ? 'BrowserStack' : 'Local'}`);
  
  let androidCapabilities;
  let driverOptions;
  
  if (isBrowserStack) {
    // BrowserStack capabilities
    androidCapabilities = {
      'platformName': 'Android',
      'appium:deviceName': process.env.DEVICE_NAME || 'Google Pixel 7',
      'appium:platformVersion': process.env.PLATFORM_VERSION || '13.0',
      'appium:app': process.env.BROWSERSTACK_APP_ID,
      'bstack:options': {
        'userName': process.env.BROWSERSTACK_USERNAME,
        'accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
        'projectName': 'Mobile Test Framework',
        'buildName': 'Android Build ' + new Date().toISOString(),
        'sessionName': 'Android Test',
        'debug': true,
        'networkLogs': true
      }
    };
    
    // Parse the BrowserStack URL
    const appiumUrl = process.env.APPIUM_URL || '';
    let hostname, path, user, key;
    
    try {
      const bsUrlParts = new URL(appiumUrl);
      hostname = bsUrlParts.hostname;
      path = bsUrlParts.pathname || '/wd/hub';
      user = bsUrlParts.username || process.env.BROWSERSTACK_USERNAME;
      key = bsUrlParts.password || process.env.BROWSERSTACK_ACCESS_KEY;
    } catch (error) {
      logger.error('Failed to parse BrowserStack URL, using default values');
      hostname = 'hub-cloud.browserstack.com';
      path = '/wd/hub';
      user = process.env.BROWSERSTACK_USERNAME;
      key = process.env.BROWSERSTACK_ACCESS_KEY;
    }
    
    driverOptions = {
      logLevel: 'info',
      hostname: hostname,
      port: 443,
      path: path,
      user: user,
      key: key,
      capabilities: androidCapabilities
    };
    
    logger.info('Using BrowserStack configuration:', JSON.stringify(driverOptions, null, 2));
  } else {
    // Local capabilities
    androidCapabilities = {
      platformName: 'Android',
      'appium:deviceName': 'emulator-5554',
      'appium:platformVersion': '16',
      'appium:automationName': 'UiAutomator2',
      'appium:app': '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/Android.SauceLabs.Mobile.Sample.app.2.7.1.apk',
      'appium:appActivity': 'com.swaglabsmobileapp.MainActivity',
      'appium:appPackage': 'com.swaglabsmobileapp',
      'appium:noReset': false,
      'appium:newCommandTimeout': 240,
      'appium:autoGrantPermissions': true,
      'appium:ensureWebviewsHavePages': true,
      'appium:nativeWebScreenshot': true,
      'appium:connectHardwareKeyboard': true,
      'appium:unicodeKeyboard': true,
      'appium:resetKeyboard': true
    };
    
    driverOptions = {
      logLevel: 'info',
      hostname: 'localhost',
      port: 4723,
      path: '/wd/hub',
      capabilities: androidCapabilities
    };
  }

  // Use the direct driver initialization method
  try {
    logger.info('Initializing Android driver with capabilities for ' + 
      (isBrowserStack ? 'BrowserStack' : 'local emulator'));
    
    // Import webdriverio dynamically to avoid TypeScript errors
    const webdriverio = require('webdriverio');
    
    // Create a direct WebdriverIO session with our capabilities
    const driver = await webdriverio.remote(driverOptions);
    
    // Assign to this.driver after initialization
    this.driver = driver;
    
    logger.info('Direct Android driver initialized successfully');
    
    // Add device information to Allure environment file
    try {
      const isBrowserStack = process.env.APPIUM_URL?.includes('browserstack');
      
      // Use Record<string, string> to allow arbitrary properties
      const deviceInfo: Record<string, string> = {
        'platform': 'Android',
        'deviceName': process.env.DEVICE_NAME || 'emulator-5554',
        'platformVersion': process.env.PLATFORM_VERSION || '16',
        'automationName': 'UiAutomator2',
        'appiumUrl': process.env.APPIUM_URL || 'http://localhost:4723',
        'testDate': new Date().toISOString(),
        'framework': 'TypeScript Mobile Testing Framework',
        'environment': isBrowserStack ? 'BrowserStack' : 'Local'
      };
      
      // Add BrowserStack specific info if applicable
      if (isBrowserStack) {
        deviceInfo['browserStackUser'] = process.env.BROWSERSTACK_USERNAME || '';
        deviceInfo['browserStackAppId'] = process.env.BROWSERSTACK_APP_ID || '';
      }
      
      // Ensure allure-results directory exists
      const allureDir = path.resolve(process.cwd(), 'allure-results');
      if (!fs.existsSync(allureDir)) {
        fs.mkdirSync(allureDir, { recursive: true });
      }
      
      // Write Android device info to allure environment properties
      const envFilePath = path.join(allureDir, 'environment.properties');
      let envContent = '';
      
      // Add each property
      Object.entries(deviceInfo).forEach(([key, value]) => {
        envContent += `${key}=${value}\n`;
      });
      
      fs.writeFileSync(envFilePath, envContent);
      logger.info('Added Android device information to Allure environment report');
    } catch (error) {
      logger.error('Failed to write Android device info to Allure report', error);
    }
  } catch (error) {
    logger.error('Failed to initialize direct Android driver', error);
    throw error;
  }
});
