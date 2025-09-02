import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { WebViewHelper } from '../../../core/utils/webview-helper';
import { Logger } from '../../../core/utils/logger';
import { expect } from 'chai';

const logger = new Logger('WebViewSteps');
const webViewHelper = new WebViewHelper();

/**
 * WebView related step definitions
 */

/**
 * Switch to WebView context
 */
When('I switch to WebView context', async function(this: TestWorld) {
  logger.info('Switching to WebView context');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  await webViewHelper.switchToWebView(this.driver);
});

/**
 * Switch to Native app context
 */
When('I switch to Native app context', async function(this: TestWorld) {
  logger.info('Switching to Native app context');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  await webViewHelper.switchToNative(this.driver);
});

/**
 * Wait for WebView context to be available
 */
When('I wait for WebView context {int} ms', async function(this: TestWorld, timeout: number) {
  logger.info(`Waiting for WebView context with timeout ${timeout}ms`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  const found = await webViewHelper.waitForWebViewContext(this.driver, timeout);
  
  if (!found) {
    throw new Error('WebView context not found within the specified timeout');
  }
});

/**
 * Verify if WebView context exists
 */
Then('WebView context should exist', async function(this: TestWorld) {
  logger.info('Verifying WebView context exists');
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  const contexts = await webViewHelper.getContexts(this.driver);
  const hasWebView = contexts.some((context: string) => context.includes('WEBVIEW'));
  
  expect(hasWebView).to.be.true;
});

/**
 * Execute JavaScript in WebView
 */
When('I execute JavaScript {string} in WebView', async function(this: TestWorld, script: string) {
  logger.info(`Executing JavaScript in WebView: ${script}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  // Save current context to restore later
  const originalContext = await this.driver.getContext();
  
  try {
    // Switch to WebView context
    await webViewHelper.switchToWebView(this.driver);
    
    // Execute script
    const result = await this.driver.executeScript(script, []);
    
    // Store the result in test data for later use
    this.setTestData('javascriptResult', result);
    logger.info(`JavaScript execution result: ${JSON.stringify(result)}`);
  } finally {
    // Make sure to switch back to the original context
    await this.driver.switchContext(String(originalContext));
  }
});

/**
 * Navigate to URL in WebView
 */
When('I navigate to {string} in WebView', async function(this: TestWorld, url: string) {
  logger.info(`Navigating to URL in WebView: ${url}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  // Save current context to restore if needed
  const originalContext = await this.driver.getContext();
  
  try {
    // Switch to WebView context
    await webViewHelper.switchToWebView(this.driver);
    
    // Navigate to URL
    await this.driver.url(url);
    
    // Wait for page to load
    await this.driver.pause(1000);
    
    const currentUrl = await this.driver.getUrl();
    logger.info(`Current URL in WebView: ${currentUrl}`);
  } catch (error) {
    logger.error('Failed to navigate in WebView', error);
    throw error;
  } finally {
    // Switch back to original context
    await this.driver.switchContext(String(originalContext));
  }
});

/**
 * Interact with elements in WebView using CSS selectors
 */
When('I click on element {string} in WebView', async function(this: TestWorld, selector: string) {
  logger.info(`Clicking on element in WebView: ${selector}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  // Save current context
  const originalContext = await this.driver.getContext();
  
  try {
    // Switch to WebView context
    await webViewHelper.switchToWebView(this.driver);
    
    // Find and click the element
    const element = await this.driver.$(selector);
    await element.waitForExist({ timeout: 10000 });
    await element.click();
  } catch (error) {
    logger.error(`Failed to click on element ${selector} in WebView`, error);
    throw error;
  } finally {
    // Switch back to original context
    await this.driver.switchContext(String(originalContext));
  }
});

/**
 * Set text in WebView input element
 */
When('I set text {string} to element {string} in WebView', async function(this: TestWorld, text: string, selector: string) {
  logger.info(`Setting text "${text}" to element ${selector} in WebView`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  // Save current context
  const originalContext = await this.driver.getContext();
  
  try {
    // Switch to WebView context
    await webViewHelper.switchToWebView(this.driver);
    
    // Find the element and set text
    const element = await this.driver.$(selector);
    await element.waitForExist({ timeout: 10000 });
    await element.clearValue();
    await element.setValue(text);
  } catch (error) {
    logger.error(`Failed to set text on element ${selector} in WebView`, error);
    throw error;
  } finally {
    // Switch back to original context
    await this.driver.switchContext(String(originalContext));
  }
});

/**
 * Verify text in WebView element
 */
Then('element {string} in WebView should contain text {string}', async function(this: TestWorld, selector: string, expectedText: string) {
  logger.info(`Verifying element ${selector} in WebView contains text "${expectedText}"`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  // Save current context
  const originalContext = await this.driver.getContext();
  
  try {
    // Switch to WebView context
    await webViewHelper.switchToWebView(this.driver);
    
    // Find the element and verify text
    const element = await this.driver.$(selector);
    await element.waitForExist({ timeout: 10000 });
    const actualText = await element.getText();
    
    expect(actualText).to.include(expectedText);
  } catch (error) {
    logger.error(`Failed to verify text on element ${selector} in WebView`, error);
    throw error;
  } finally {
    // Switch back to original context
    await this.driver.switchContext(String(originalContext));
  }
});
