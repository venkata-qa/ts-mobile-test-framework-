import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('UiSteps');

/**
 * Common UI steps for both web and mobile testing
 * These steps are specifically for interactions with UI elements
 */

// Element interaction steps
When('I click on element {string}', async function(this: TestWorld, selector: string) {
  logger.info(`Clicking on element: ${selector}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot interact with UI elements.');
  }
  
  const element = await this.driver.$(selector);
  await element.waitForClickable({ timeout: 10000 });
  await element.click();
});

When('I type {string} into element {string}', async function(this: TestWorld, text: string, selector: string) {
  logger.info(`Typing "${text}" into element: ${selector}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot interact with UI elements.');
  }
  
  const element = await this.driver.$(selector);
  await element.waitForDisplayed({ timeout: 10000 });
  await element.setValue(text);
});

When('I clear element {string}', async function(this: TestWorld, selector: string) {
  logger.info(`Clearing element: ${selector}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot interact with UI elements.');
  }
  
  const element = await this.driver.$(selector);
  await element.waitForDisplayed({ timeout: 10000 });
  await element.clearValue();
});

// Element validation steps
Then('element {string} should be displayed', async function(this: TestWorld, selector: string) {
  logger.info(`Verifying element is displayed: ${selector}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot interact with UI elements.');
  }
  
  const element = await this.driver.$(selector);
  const isDisplayed = await element.isDisplayed();
  
  if (!isDisplayed) {
    throw new Error(`Element ${selector} is not displayed`);
  }
});

Then('element {string} should contain text {string}', async function(this: TestWorld, selector: string, expectedText: string) {
  logger.info(`Verifying element ${selector} contains text: ${expectedText}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot interact with UI elements.');
  }
  
  const element = await this.driver.$(selector);
  await element.waitForDisplayed({ timeout: 10000 });
  
  const actualText = await element.getText();
  if (!actualText.includes(expectedText)) {
    throw new Error(`Element ${selector} text "${actualText}" does not contain "${expectedText}"`);
  }
});

Then('element {string} should have attribute {string} with value {string}', async function(
  this: TestWorld, 
  selector: string, 
  attribute: string, 
  expectedValue: string
) {
  logger.info(`Verifying element ${selector} has attribute ${attribute} with value: ${expectedValue}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot interact with UI elements.');
  }
  
  const element = await this.driver.$(selector);
  const actualValue = await element.getAttribute(attribute);
  
  if (actualValue !== expectedValue) {
    throw new Error(
      `Element ${selector} attribute ${attribute} has value "${actualValue}" but expected "${expectedValue}"`
    );
  }
});

// Navigation steps
When('I refresh the page', async function(this: TestWorld) {
  logger.info('Refreshing page');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot refresh page.');
  }
  
  await this.driver.refresh();
});

When('I go back', async function(this: TestWorld) {
  logger.info('Navigating back');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot navigate back.');
  }
  
  await this.driver.back();
});

// Keyboard actions
When('I press key {string}', async function(this: TestWorld, key: string) {
  logger.info(`Pressing key: ${key}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized. Cannot press keys.');
  }
  
  await this.driver.keys(key);
});
