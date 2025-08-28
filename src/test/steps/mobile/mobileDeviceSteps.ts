import { When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { MobileBaseSetup } from './mobileBaseSetup';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('MobileDeviceSteps');

/**
 * Pre-defined steps for mobile device operations
 * Similar to the Java implementation's PrebuiltDeviceSteps
 */

/**
 * Set the device orientation
 */
When('I set the device orientation to {string}', async function(this: TestWorld, orientation: string) {
  logger.info(`Setting device orientation to ${orientation}`);
  
  const upperOrientation = orientation.toUpperCase();
  
  if (!['LANDSCAPE', 'PORTRAIT'].includes(upperOrientation)) {
    throw new Error(`Invalid orientation: ${orientation}. Must be LANDSCAPE or PORTRAIT`);
  }
  
  await this.driver!.setOrientation(upperOrientation as 'LANDSCAPE' | 'PORTRAIT');
});

/**
 * Take a screenshot
 */
When('I take a screenshot named {string}', async function(this: TestWorld, name: string) {
  logger.info(`Taking screenshot named ${name}`);
  await this.takeScreenshot(name);
});

/**
 * Lock the device for a specified duration
 */
When('I lock the device for {int} seconds', async function(this: TestWorld, seconds: number) {
  logger.info(`Locking device for ${seconds} seconds`);
  
  // Get platform type
  const caps = await this.driver!.capabilities as any;
  const platformName = caps.platformName?.toLowerCase() || '';
  
  if (platformName === 'android') {
    await this.driver!.lock(seconds);
  } else if (platformName === 'ios') {
    await this.driver!.lock(seconds);
  } else {
    throw new Error(`Unsupported platform: ${platformName}`);
  }
});

/**
 * Unlock the device 
 */
When('I unlock the device', async function(this: TestWorld) {
  logger.info('Unlocking the device');
  await this.driver!.unlock();
});

/**
 * Press a specific key on the device
 */
When('I press the {string} key', async function(this: TestWorld, key: string) {
  logger.info(`Pressing the ${key} key`);
  
  // Get platform type
  const caps = await this.driver!.capabilities as any;
  const platformName = caps.platformName?.toLowerCase() || '';
  
  if (platformName === 'android') {
    const keyCode = getAndroidKeyCode(key);
    await this.driver!.pressKeyCode(keyCode);
  } else if (platformName === 'ios') {
    // iOS doesn't have direct keycode support like Android
    // For some common keys, we can use workarounds
    switch (key.toLowerCase()) {
      case 'home':
        await this.driver!.execute('mobile: pressButton', { name: 'home' });
        break;
      case 'back':
        // In iOS, navigate back using the back button if it exists
        try {
          await this.driver!.back();
        } catch (error) {
          logger.warn('Back navigation not supported', error);
        }
        break;
      default:
        logger.warn(`Key press for key "${key}" not supported on iOS`);
    }
  }
});

/**
 * Close the app
 */
When('I close the app', async function(this: TestWorld) {
  logger.info('Closing the app');
  await this.driver!.closeApp();
});

/**
 * Launch the app
 */
When('I launch the app', async function(this: TestWorld) {
  logger.info('Launching the app');
  await this.driver!.launchApp();
});

/**
 * Reset the app
 */
When('I reset the app', async function(this: TestWorld) {
  logger.info('Resetting the app');
  await this.driver!.closeApp();
  await this.driver!.launchApp();
});

/**
 * Handle permissions request dialog by accepting or denying
 */
When('I {string} the permission dialog if visible', async function(this: TestWorld, action: string) {
  logger.info(`Attempting to ${action} permission dialog if visible`);
  
  // Get platform type
  const caps = await this.driver!.capabilities as any;
  const platformName = caps.platformName?.toLowerCase() || '';
  
  // Different approach based on platform
  try {
    if (platformName === 'android') {
      // Try to find permission dialog button
      const buttonSelector = action.toLowerCase() === 'accept' 
        ? 'android=new UiSelector().text("Allow")'
        : 'android=new UiSelector().text("Deny")';
        
      // Check if the button is visible
      const button = await this.driver!.$(buttonSelector);
      const isVisible = await button.isDisplayed();
      
      if (isVisible) {
        await button.click();
        logger.info('Permission dialog handled successfully');
      } else {
        logger.info('No permission dialog visible');
      }
    } else if (platformName === 'ios') {
      // Try to find permission dialog button
      const buttonSelector = action.toLowerCase() === 'accept'
        ? 'Allow'
        : 'Don\'t Allow';
        
      // Check if button exists using predicate
      const button = await this.driver!.$(`-ios predicate string:label == "${buttonSelector}"`);
      const isVisible = await button.isDisplayed();
      
      if (isVisible) {
        await button.click();
        logger.info('Permission dialog handled successfully');
      } else {
        logger.info('No permission dialog visible');
      }
    }
  } catch (error) {
    logger.warn('Error handling permission dialog, may not be present', error);
  }
});

/**
 * Helper function to get Android key codes
 */
function getAndroidKeyCode(key: string): number {
  const keyCodes: {[key: string]: number} = {
    'home': 3,
    'back': 4,
    'call': 5,
    'endcall': 6,
    'volume_up': 24,
    'volume_down': 25,
    'power': 26,
    'camera': 27,
    'enter': 66,
    'delete': 67,
    'menu': 82,
    'search': 84
  };
  
  const keyCode = keyCodes[key.toLowerCase()];
  if (keyCode === undefined) {
    throw new Error(`Unknown key: ${key}`);
  }
  
  return keyCode;
}
