import { Given, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('SauceLabsSteps');

/**
 * Legacy step definition for backward compatibility with existing tests
 * Ensures SauceLabs app is ready for interaction by checking for login page elements
 */
Given('I am on the SauceLabs demo app', async function(this: TestWorld) {
  try {
    logger.info('Ensuring the SauceLabs demo app is launched and ready');
    
    // The app should already be launched by hooks.ts before this step
    // We just need to make sure we're on the login page
    
    // Wait a moment for the app to stabilize
    await this.driver!.pause(1000);
    
    // Check for the username field to confirm we're on the login page
    const usernameField = await this.driver!.$('~test-Username');
    
    // Wait for the element to be displayed
    await usernameField.waitForDisplayed({ timeout: 10000 });
    
    logger.info('SauceLabs demo app is launched and on the login page');
  } catch (error) {
    logger.error('Failed to verify SauceLabs demo app is launched', error);
    throw error;
  }
});

/**
 * Step definition to support data-driven tests that verify login success/failure status
 */
Then('I should see the {string} status', async function(this: TestWorld, status: string) {
  try {
    logger.info(`Verifying login status: ${status}`);
    
    if (status === 'success') {
      // Check for successful login - products page is displayed
      const productsLabel = await this.driver!.$('~test-PRODUCTS');
      await productsLabel.waitForDisplayed({ timeout: 10000 });
      logger.info('Login successful - products page is displayed');
    } else if (status === 'failure') {
      // Check for error message on login page
      const errorMessage = await this.driver!.$('~test-Error message');
      await errorMessage.waitForDisplayed({ timeout: 10000 });
      logger.info('Login failed - error message is displayed');
    } else {
      throw new Error(`Unsupported login status: ${status}`);
    }
  } catch (error) {
    logger.error(`Failed to verify login status: ${status}`, error);
    throw error;
  }
});
