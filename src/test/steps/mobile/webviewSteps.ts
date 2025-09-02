import { Given, When, Then, Before } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { WebViewHelper } from '../../../core/utils/webview-helper';
import { Logger } from '../../../core/utils/logger';
import { expect } from 'chai';
import { MobileBaseSetup } from './mobileBaseSetup';

const logger = new Logger('WebViewSteps');

/**
 * WebView related step definitions
 * Updated to use page object pattern similar to other mobile steps
 */
export class WebViewSteps extends MobileBaseSetup {
  private webViewHelper: WebViewHelper;
  
  constructor(world: TestWorld) {
    super(world);
    this.webViewHelper = new WebViewHelper();
  }
  
  /**
   * Switch to WebView context
   */
  async switchToWebView(): Promise<void> {
    logger.info('Switching to WebView context');
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    await this.webViewHelper.switchToWebView(this.driver);
  }
  
  /**
   * Switch to Native app context
   */
  async switchToNativeApp(): Promise<void> {
    logger.info('Switching to Native app context');
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    await this.webViewHelper.switchToNative(this.driver);
  }
  
  /**
   * Wait for WebView context to be available
   */
  async waitForWebViewContext(timeout: number): Promise<void> {
    logger.info(`Waiting for WebView context with timeout ${timeout}ms`);
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    const found = await this.webViewHelper.waitForWebViewContext(this.driver, timeout);
    
    if (!found) {
      throw new Error('WebView context not found within the specified timeout');
    }
  }
  
  /**
   * Verify if WebView context exists
   */
  async verifyWebViewExists(): Promise<void> {
    logger.info('Verifying WebView context exists');
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    const contexts = await this.webViewHelper.getContexts(this.driver);
    const hasWebView = contexts.some((context: string) => context.includes('WEBVIEW'));
    
    expect(hasWebView).to.be.true;
  }
  
  /**
   * Execute JavaScript in WebView
   */
  async executeJavaScript(script: string): Promise<any> {
    logger.info(`Executing JavaScript in WebView: ${script}`);
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    // Save current context to restore later
    const originalContext = await this.driver.getContext();
    
    try {
      // Switch to WebView context
      await this.webViewHelper.switchToWebView(this.driver);
      
      // Execute script
      const result = await this.driver.executeScript(script, []);
      
      // Store the result in test data for later use
      this.world.setTestData('javascriptResult', result);
      logger.info(`JavaScript execution result: ${JSON.stringify(result)}`);
      
      return result;
    } finally {
      // Make sure to switch back to the original context
      await this.driver.switchContext(String(originalContext));
    }
  }
  
  /**
   * Navigate to URL in WebView
   */
  async navigateToUrl(url: string): Promise<void> {
    logger.info(`Navigating to URL in WebView: ${url}`);
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    // Save current context to restore if needed
    const originalContext = await this.driver.getContext();
    
    try {
      // Switch to WebView context
      await this.webViewHelper.switchToWebView(this.driver);
      
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
  }
  
  /**
   * Click on element in WebView using page object pattern
   * @param elementName Element name in the page object
   * @param pageClassName Page class name containing the element
   */
  async clickWebViewElement(elementName: string, pageClassName: string): Promise<void> {
    logger.info(`Clicking on WebView element "${elementName}" in page "${pageClassName}"`);
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    // Save current context
    const originalContext = await this.driver.getContext();
    
    try {
      // Switch to WebView context
      await this.webViewHelper.switchToWebView(this.driver);
      
      // Get the element using the page object pattern
      const element = await this.loadWebElement(elementName, pageClassName);
      
      // Click on the element
      await element.waitForExist({ timeout: 10000 });
      await element.click();
    } catch (error) {
      logger.error(`Failed to click on WebView element "${elementName}" in page "${pageClassName}"`, error);
      throw error;
    } finally {
      // Switch back to original context
      await this.driver.switchContext(String(originalContext));
    }
  }
  
  /**
   * Set text in WebView element using page object pattern
   * @param text Text to enter
   * @param elementName Element name in the page object
   * @param pageClassName Page class name containing the element
   */
  async setWebViewText(text: string, elementName: string, pageClassName: string): Promise<void> {
    logger.info(`Setting text "${text}" to WebView element "${elementName}" in page "${pageClassName}"`);
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    // Save current context
    const originalContext = await this.driver.getContext();
    
    try {
      // Switch to WebView context
      await this.webViewHelper.switchToWebView(this.driver);
      
      // Get the element using the page object pattern
      const element = await this.loadWebElement(elementName, pageClassName);
      
      // Set text on the element
      await element.waitForExist({ timeout: 10000 });
      await element.clearValue();
      await element.setValue(text);
    } catch (error) {
      logger.error(`Failed to set text on WebView element "${elementName}" in page "${pageClassName}"`, error);
      throw error;
    } finally {
      // Switch back to original context
      await this.driver.switchContext(String(originalContext));
    }
  }
  
  /**
   * Verify text in WebView element using page object pattern
   * @param elementName Element name in the page object
   * @param pageClassName Page class name containing the element
   * @param expectedText Expected text to verify
   */
  async verifyWebViewElementText(elementName: string, pageClassName: string, expectedText: string): Promise<void> {
    logger.info(`Verifying WebView element "${elementName}" in page "${pageClassName}" contains text "${expectedText}"`);
    
    if (!this.driver) {
      throw new Error('Driver is not initialized');
    }
    
    // Save current context
    const originalContext = await this.driver.getContext();
    
    try {
      // Switch to WebView context
      await this.webViewHelper.switchToWebView(this.driver);
      
      // Get the element using the page object pattern
      const element = await this.loadWebElement(elementName, pageClassName);
      
      // Verify text
      await element.waitForExist({ timeout: 10000 });
      const actualText = await element.getText();
      
      expect(actualText).to.include(expectedText);
    } catch (error) {
      logger.error(`Failed to verify text in WebView element "${elementName}" in page "${pageClassName}"`, error);
      throw error;
    } finally {
      // Switch back to original context
      await this.driver.switchContext(String(originalContext));
    }
  }
}

// Create an instance that will be used in the step definitions
let webViewSteps: WebViewSteps;

// Before hooks will create a new instance for each scenario
Before(async function (this: TestWorld) {
  webViewSteps = new WebViewSteps(this);
});

/**
 * Switch to WebView context
 */
When('I switch to WebView context', async function(this: TestWorld) {
  await webViewSteps.switchToWebView();
});

/**
 * Switch to Native app context
 */
When('I switch to Native app context', async function(this: TestWorld) {
  await webViewSteps.switchToNativeApp();
});

/**
 * Wait for WebView context to be available
 */
When('I wait for WebView context {int} ms', async function(this: TestWorld, timeout: number) {
  await webViewSteps.waitForWebViewContext(timeout);
});

/**
 * Verify if WebView context exists
 */
Then('WebView context should exist', async function(this: TestWorld) {
  await webViewSteps.verifyWebViewExists();
});

/**
 * Execute JavaScript in WebView
 */
When('I execute JavaScript {string} in WebView', async function(this: TestWorld, script: string) {
  await webViewSteps.executeJavaScript(script);
});

/**
 * Navigate to URL in WebView
 */
When('I navigate to {string} in WebView', async function(this: TestWorld, url: string) {
  await webViewSteps.navigateToUrl(url);
});

/**
 * Click on element in WebView using page object pattern
 */
When('I tap on the {string} element in the {string} WebView page', async function(this: TestWorld, elementName: string, pageClassName: string) {
  await webViewSteps.clickWebViewElement(elementName, pageClassName);
});

/**
 * Set text in WebView element using page object pattern
 */
When('I type {string} into the {string} field in the {string} WebView page', async function(this: TestWorld, text: string, elementName: string, pageClassName: string) {
  await webViewSteps.setWebViewText(text, elementName, pageClassName);
});

/**
 * Verify text in WebView element using page object pattern
 */
Then('the {string} element in the {string} WebView page should contain text {string}', async function(this: TestWorld, elementName: string, pageClassName: string, expectedText: string) {
  await webViewSteps.verifyWebViewElementText(elementName, pageClassName, expectedText);
});

/**
 * Legacy step definitions for backward compatibility (direct CSS selector based)
 */

/**
 * Click on element in WebView using CSS selector (legacy)
 */
When('I click on element {string} in WebView', async function(this: TestWorld, selector: string) {
  logger.info(`[LEGACY] Clicking on element in WebView using selector: ${selector}`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  const originalContext = await this.driver.getContext();
  try {
    await webViewSteps.switchToWebView();
    const element = await this.driver.$(selector);
    await element.waitForExist({ timeout: 10000 });
    await element.click();
  } catch (error: any) {
    logger.error(`Failed to click on element ${selector} in WebView`, error);
    throw error;
  } finally {
    await this.driver.switchContext(String(originalContext));
  }
});

/**
 * Set text in WebView element using CSS selector (legacy)
 */
When('I set text {string} to element {string} in WebView', async function(this: TestWorld, text: string, selector: string) {
  logger.info(`[LEGACY] Setting text "${text}" to element using selector: ${selector} in WebView`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  const originalContext = await this.driver.getContext();
  try {
    await webViewSteps.switchToWebView();
    const element = await this.driver.$(selector);
    await element.waitForExist({ timeout: 10000 });
    await element.clearValue();
    await element.setValue(text);
  } catch (error: any) {
    logger.error(`Failed to set text on element ${selector} in WebView`, error);
    throw error;
  } finally {
    await this.driver.switchContext(String(originalContext));
  }
});

/**
 * Verify text in WebView element using CSS selector (legacy)
 */
Then('element {string} in WebView should contain text {string}', async function(this: TestWorld, selector: string, expectedText: string) {
  logger.info(`[LEGACY] Verifying element using selector: ${selector} in WebView contains text "${expectedText}"`);
  
  if (!this.driver) {
    throw new Error('Driver is not initialized');
  }
  
  const originalContext = await this.driver.getContext();
  try {
    await webViewSteps.switchToWebView();
    const element = await this.driver.$(selector);
    await element.waitForExist({ timeout: 10000 });
    const actualText = await element.getText();
    expect(actualText).to.include(expectedText);
  } catch (error: any) {
    logger.error(`Failed to verify text on element ${selector} in WebView`, error);
    throw error;
  } finally {
    await this.driver.switchContext(String(originalContext));
  }
});
