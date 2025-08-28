import { Given } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('SauceLabsSteps');

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
