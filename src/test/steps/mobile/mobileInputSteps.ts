import { When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { MobileBaseSetup } from './mobileBaseSetup';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('MobileInputSteps');

/**
 * Pre-defined steps for mobile input operations
 * Similar to the Java implementation's PrebuiltInputSteps
 */

/**
 * Tap on an element identified by name in a page object
 */
When('I tap on {string} on {string}', async function(this: TestWorld, elementName: string, pageClassName: string) {
  logger.info(`Tapping on ${elementName} on page ${pageClassName}`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  await element.waitForDisplayed({ timeout: 10000 });
  await element.click();
});

/**
 * Enter text into a field identified by name in a page object
 */
When('I enter {string} into {string} on {string}', async function(this: TestWorld, text: string, elementName: string, pageClassName: string) {
  logger.info(`Entering "${text}" into ${elementName} on page ${pageClassName}`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  await element.waitForDisplayed({ timeout: 10000 });
  await element.clearValue();
  await element.setValue(text);
});

/**
 * Clear text from a field identified by name in a page object
 */
When('I clear {string} on {string}', async function(this: TestWorld, elementName: string, pageClassName: string) {
  logger.info(`Clearing text from ${elementName} on page ${pageClassName}`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  await element.waitForDisplayed({ timeout: 10000 });
  await element.clearValue();
});

/**
 * Toggle a switch/checkbox identified by name in a page object
 */
When('I toggle {string} on {string}', async function(this: TestWorld, elementName: string, pageClassName: string) {
  logger.info(`Toggling switch/checkbox ${elementName} on page ${pageClassName}`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  await element.waitForDisplayed({ timeout: 10000 });
  await element.click();
});

/**
 * Tap on element by visible text
 */
When('I tap on element with text {string}', async function(this: TestWorld, text: string) {
  logger.info(`Tapping on element with text "${text}"`);
  
  // Get platform type
  const caps = await this.driver!.capabilities as any;
  const platformName = caps.platformName?.toLowerCase() || '';
  
  let element;
  if (platformName === 'android') {
    element = await this.driver!.$(`android=new UiSelector().text("${text}")`);
  } else if (platformName === 'ios') {
    element = await this.driver!.$(`-ios predicate string:label == "${text}" OR name == "${text}" OR value == "${text}"`);
  } else {
    // Generic XPath approach
    element = await this.driver!.$(`//*[@text="${text}" or @label="${text}" or @value="${text}" or contains(text(),"${text}")]`);
  }
  
  await element.waitForDisplayed({ timeout: 10000 });
  await element.click();
});

/**
 * Long press on an element identified by name in a page object
 */
When('I long press on {string} on {string} for {int} ms', async function(this: TestWorld, elementName: string, pageClassName: string, duration: number) {
  logger.info(`Long pressing on ${elementName} on page ${pageClassName} for ${duration}ms`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  await element.waitForDisplayed({ timeout: 10000 });
  
  await this.driver!.performActions([
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

/**
 * Wait for an element to be displayed
 */
When('I wait for {string} on {string} to be displayed', async function(this: TestWorld, elementName: string, pageClassName: string) {
  logger.info(`Waiting for ${elementName} on page ${pageClassName} to be displayed`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  await element.waitForDisplayed({ timeout: 30000 });
});

/**
 * Wait for a fixed amount of time (use sparingly!)
 */
When('I wait for {int} seconds', async function(this: TestWorld, seconds: number) {
  logger.info(`Waiting for ${seconds} seconds`);
  await this.driver!.pause(seconds * 1000);
});

/**
 * Verify that an element is displayed
 */
Then('I should see {string} on {string}', async function(this: TestWorld, elementName: string, pageClassName: string) {
  logger.info(`Verifying ${elementName} is displayed on page ${pageClassName}`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  const isDisplayed = await element.isDisplayed();
  if (!isDisplayed) {
    throw new Error(`Element "${elementName}" is not displayed on page "${pageClassName}"`);
  }
});

/**
 * Verify element text contains expected value
 */
Then('the text of {string} on {string} should contain {string}', async function(this: TestWorld, elementName: string, pageClassName: string, expectedText: string) {
  logger.info(`Verifying text of ${elementName} on page ${pageClassName} contains "${expectedText}"`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  await element.waitForDisplayed({ timeout: 10000 });
  const actualText = await element.getText();
  
  if (!actualText.includes(expectedText)) {
    throw new Error(`Element text "${actualText}" does not contain "${expectedText}"`);
  }
});

/**
 * Verify element text equals expected value
 */
Then('the text of {string} on {string} should be {string}', async function(this: TestWorld, elementName: string, pageClassName: string, expectedText: string) {
  logger.info(`Verifying text of ${elementName} on page ${pageClassName} equals "${expectedText}"`);
  
  const baseSetup = new MobileBaseSetup(this);
  const element = await baseSetup.loadWebElement(elementName, pageClassName);
  
  await element.waitForDisplayed({ timeout: 10000 });
  const actualText = await element.getText();
  
  if (actualText !== expectedText) {
    throw new Error(`Element text "${actualText}" does not equal "${expectedText}"`);
  }
});
