import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('MobileSteps');

/**
 * Common steps for mobile testing (Android and iOS)
 * These steps handle mobile-specific interactions like gestures, app lifecycle, etc.
 */

// App lifecycle steps
Given('the app is launched', function(this: TestWorld) {
  logger.info('App is launched via driver initialization in hooks');
  // The app is automatically launched when the driver is initialized in hooks
});

When('I close the app', async function(this: TestWorld) {
  logger.info('Closing the app');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot close app.');
  }
  
  await this.driver.closeApp();
});

When('I restart the app', async function(this: TestWorld) {
  logger.info('Restarting the app');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot restart app.');
  }
  
  await this.driver.closeApp();
  await this.driver.launchApp();
});

When('I background the app for {int} seconds', async function(this: TestWorld, seconds: number) {
  logger.info(`Backgrounding the app for ${seconds} seconds`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot background app.');
  }
  
  await this.driver.background(seconds);
});

// Mobile gestures
When('I swipe {string}', async function(this: TestWorld, direction: string) {
  logger.info(`Swiping ${direction}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot perform swipe.');
  }
  
  const validDirections = ['up', 'down', 'left', 'right'];
  if (!validDirections.includes(direction.toLowerCase())) {
    throw new Error(`Invalid swipe direction: ${direction}. Must be one of: ${validDirections.join(', ')}`);
  }
  
  const { width, height } = await this.driver.getWindowRect();
  
  let startX, startY, endX, endY;
  switch (direction.toLowerCase()) {
    case 'up':
      startX = width / 2;
      startY = height * 0.7;
      endX = width / 2;
      endY = height * 0.3;
      break;
    case 'down':
      startX = width / 2;
      startY = height * 0.3;
      endX = width / 2;
      endY = height * 0.7;
      break;
    case 'left':
      startX = width * 0.7;
      startY = height / 2;
      endX = width * 0.3;
      endY = height / 2;
      break;
    case 'right':
      startX = width * 0.3;
      startY = height / 2;
      endX = width * 0.7;
      endY = height / 2;
      break;
  }
  
  await this.driver.touchAction([
    { action: 'press', x: startX, y: startY },
    { action: 'wait', ms: 200 },
    { action: 'moveTo', x: endX, y: endY },
    { action: 'release' }
  ]);
});

When('I tap at coordinates {int},{int}', async function(this: TestWorld, x: number, y: number) {
  logger.info(`Tapping at coordinates: ${x},${y}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot perform tap.');
  }
  
  await this.driver.touchAction([
    { action: 'tap', x, y }
  ]);
});

When('I long press on element {string} for {int} ms', async function(this: TestWorld, selector: string, duration: number) {
  logger.info(`Long pressing on element ${selector} for ${duration}ms`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot perform long press.');
  }
  
  const element = await this.driver.$(selector);
  await element.waitForDisplayed({ timeout: 10000 });
  
  await this.driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, origin: element, x: 0, y: 0 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: duration },
        { type: 'pointerUp', button: 0 }
      ]
    }
  ]);
});

// Device-specific actions
When('I set the device orientation to {string}', async function(this: TestWorld, orientation: string) {
  logger.info(`Setting device orientation to: ${orientation}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot set orientation.');
  }
  
  if (!['LANDSCAPE', 'PORTRAIT'].includes(orientation.toUpperCase())) {
    throw new Error(`Invalid orientation: ${orientation}. Must be LANDSCAPE or PORTRAIT`);
  }
  
  await this.driver.setOrientation(orientation.toUpperCase() as 'LANDSCAPE' | 'PORTRAIT');
});

When('I run the app in the background for {int} seconds', async function(this: TestWorld, seconds: number) {
  logger.info(`Running app in background for ${seconds} seconds`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot run app in background.');
  }
  
  await this.driver.background(seconds);
});

// Mobile-specific validations
Then('I should see alert with text {string}', async function(this: TestWorld, expectedText: string) {
  logger.info(`Verifying alert contains text: ${expectedText}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot check alert.');
  }
  
  const alertText = await this.driver.getAlertText();
  if (!alertText.includes(expectedText)) {
    throw new Error(`Alert text "${alertText}" does not contain "${expectedText}"`);
  }
});

When('I accept the alert', async function(this: TestWorld) {
  logger.info('Accepting alert');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot accept alert.');
  }
  
  await this.driver.acceptAlert();
});

When('I dismiss the alert', async function(this: TestWorld) {
  logger.info('Dismissing alert');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot dismiss alert.');
  }
  
  await this.driver.dismissAlert();
});
