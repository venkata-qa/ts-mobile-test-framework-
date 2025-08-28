import { When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('MobileAlertSteps');

/**
 * Pre-defined steps for mobile alert/dialog interactions
 * Similar to the Java implementation's PrebuiltAlertsAssertionSteps
 */

/**
 * Verify an alert is displayed with specific text
 */
Then('I should see an alert with text {string}', async function(this: TestWorld, expectedText: string) {
  logger.info(`Verifying alert contains text: ${expectedText}`);
  
  try {
    // Get the alert text
    const alertText = await this.driver!.getAlertText();
    
    if (!alertText.includes(expectedText)) {
      throw new Error(`Alert text "${alertText}" does not contain "${expectedText}"`);
    }
    
    logger.info('Alert text verified successfully');
  } catch (error) {
    logger.error('Failed to verify alert text', error);
    throw new Error(`Alert with text "${expectedText}" was not found or could not be verified`);
  }
});

/**
 * Accept (OK/confirm) an alert dialog
 */
When('I accept the alert', async function(this: TestWorld) {
  logger.info('Accepting alert');
  await this.driver!.acceptAlert();
});

/**
 * Dismiss (Cancel) an alert dialog
 */
When('I dismiss the alert', async function(this: TestWorld) {
  logger.info('Dismissing alert');
  await this.driver!.dismissAlert();
});

/**
 * Enter text into an alert prompt dialog
 */
When('I enter {string} into the alert', async function(this: TestWorld, text: string) {
  logger.info(`Entering text "${text}" into alert`);
  
  try {
    // Send keys to the alert
    await this.driver!.sendAlertText(text);
    logger.info('Text entered into alert successfully');
  } catch (error) {
    logger.error('Failed to enter text into alert', error);
    throw error;
  }
});

/**
 * Check if an alert is present (does not throw if alert is absent)
 */
Then('an alert {string} be present', async function(this: TestWorld, shouldOrNot: string) {
  const expectPresent = shouldOrNot.toLowerCase() === 'should';
  logger.info(`Verifying alert ${expectPresent ? 'is' : 'is not'} present`);
  
  try {
    // This will throw if no alert is present
    await this.driver!.getAlertText();
    
    if (!expectPresent) {
      throw new Error('Alert is present but was expected not to be');
    }
    
    logger.info('Alert is present as expected');
  } catch (error) {
    if (expectPresent) {
      throw new Error('Alert is not present but was expected to be');
    }
    
    logger.info('Alert is not present as expected');
  }
});
