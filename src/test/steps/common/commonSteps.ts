import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('CommonSteps');

/**
 * Common steps that can be reused across API, UI, mobile, and DB tests
 * These steps handle generic actions that are applicable to multiple testing types
 */

// Common navigation steps
Given('I navigate to {string}', async function(this: TestWorld, url: string) {
  logger.info(`Navigating to ${url}`);
  
  if (this.driver) {
    // Handle web/mobile navigation
    await this.driver.url(url);
  } else {
    // Store URL for API testing
    this.setTestData('baseUrl', url);
  }
});

// Common waiting steps
When('I wait for {int} milliseconds', async function(this: TestWorld, ms: number) {
  logger.info(`Waiting for ${ms} milliseconds`);
  await new Promise(resolve => setTimeout(resolve, ms));
});

// Common validation steps
Then('I should see {string}', async function(this: TestWorld, text: string) {
  logger.info(`Verifying text: ${text}`);
  
  if (this.driver) {
    // For UI testing
    const pageSource = await this.driver.getPageSource();
    if (!pageSource.includes(text)) {
      throw new Error(`Text "${text}" not found in page source`);
    }
  } else if (this.apiClient && this.getTestData('lastResponse')) {
    // For API testing
    const response = this.getTestData<any>('lastResponse');
    const responseText = JSON.stringify(response.data);
    if (!responseText.includes(text)) {
      throw new Error(`Text "${text}" not found in API response: ${responseText}`);
    }
  }
});

// Common steps for both API and UI testing
Then('I should see a successful response', async function(this: TestWorld) {
  logger.info('Verifying successful response');
  
  if (this.driver) {
    // For UI, check if no error is displayed
    // This is a placeholder - implement specific UI verification logic
    logger.info('UI success verification');
  } else if (this.apiClient && this.getTestData('lastResponse')) {
    // For API, check status code is 2xx
    const response = this.getTestData<any>('lastResponse');
    if (!response || response.status < 200 || response.status >= 300) {
      throw new Error(`Expected successful status code, but got: ${response?.status}`);
    }
  }
});

// Common steps for screenshots (mobile and web)
When('I take a screenshot named {string}', async function(this: TestWorld, screenshotName: string) {
  if (this.driver) {
    await this.takeScreenshot(screenshotName);
  } else {
    logger.warn('Screenshot requested but no driver available');
  }
});
