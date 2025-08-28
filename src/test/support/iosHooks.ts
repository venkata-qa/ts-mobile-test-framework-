import { Before } from '@cucumber/cucumber';
import { TestWorld } from './world';
import { Logger } from '../../core/utils/logger';
import * as fs from 'fs';
import * as path from 'path';

// Create logger for iOS hooks
const logger = new Logger('IOSHooks');

/**
 * Special hook for iOS tests to ensure we use the existing simulator
 * This hook will override the default iOS hook in hooks.ts
 */
Before({ tags: '@ios or @iosdemo' }, async function(this: TestWorld) {
  logger.info('Starting iOS scenario with specific simulator configuration');
  
  // Define the exact capabilities that worked in our direct test
  const iosCapabilities = {
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 16 Plus',
    'appium:platformVersion': '18.6',
    'appium:automationName': 'XCUITest',
    'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91',
    'appium:app': '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app',
    'appium:noReset': false,
    'appium:newCommandTimeout': 180,
    'appium:connectHardwareKeyboard': true,
    'appium:noNewCommandTimeout': true,
    'appium:showXcodeLog': true,
    'appium:usePrebuiltWDA': false,
    'appium:shouldUseSingletonTestManager': false,
    'appium:shouldTerminateApp': true,
    'appium:forceAppLaunch': true
  };

    // Initialize iOS driver with specific capabilities
  await this.initIOSDriverDirect(iosCapabilities);
  
  // Add device information to Allure environment file
  try {
    const deviceInfo = {
      'platform': 'iOS',
      'deviceName': 'iPhone 16 Plus',
      'platformVersion': '18.6',
      'automationName': 'XCUITest',
      'udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91',
      'appiumUrl': process.env.APPIUM_URL || 'http://localhost:4723',
      'testDate': new Date().toISOString(),
      'framework': 'TypeScript Mobile Testing Framework'
    };
    
    // Create allure-results directory if it doesn't exist
    const allureDir = path.resolve(process.cwd(), 'allure-results');
    if (!fs.existsSync(allureDir)) {
      fs.mkdirSync(allureDir, { recursive: true });
    }
    
    // Write environment properties file for Allure
    const envFilePath = path.join(allureDir, 'environment.properties');
    const envContent = Object.entries(deviceInfo)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(envFilePath, envContent);
    logger.info('Added device info to Allure environment properties');
  } catch (error) {
    logger.error('Failed to add device info to Allure report', error);
  }
});
