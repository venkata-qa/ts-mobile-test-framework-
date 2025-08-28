import { When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { MobileBaseSetup } from './mobileBaseSetup';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('MobileAssertSteps');

/**
 * Mobile element assertion step definitions
 * Provides steps for verifying visibility, attributes, and text of mobile elements
 */
export class MobileAssertSteps extends MobileBaseSetup {
    constructor(world: TestWorld) {
        super(world);
    }

    /**
     * Verifies if an element is visible
     * @param elementName The name of the element to verify
     * @param pageClassName The page class containing the element
     * @returns Promise resolving to true if the element is visible
     */
    async isElementVisible(elementName: string, pageClassName: string): Promise<boolean> {
        try {
            const element = await this.loadWebElement(elementName, pageClassName);
            const isDisplayed = await element.isDisplayed();
            logger.info(`Element "${elementName}" in page "${pageClassName}" is ${isDisplayed ? 'visible' : 'not visible'}`);
            return isDisplayed;
        } catch (error) {
            logger.error(`Error checking visibility of element "${elementName}"`, error);
            return false;
        }
    }

    /**
     * Waits for an element to become visible
     * @param elementName The name of the element to wait for
     * @param pageClassName The page class containing the element
     * @param timeoutMs Optional timeout in milliseconds
     */
    async waitForElementVisible(elementName: string, pageClassName: string, timeoutMs: number = 10000): Promise<void> {
        logger.info(`Waiting for element "${elementName}" in page "${pageClassName}" to be visible`);
        const element = await this.loadWebElement(elementName, pageClassName);
        
        try {
            await element.waitForDisplayed({ timeout: timeoutMs });
            logger.info(`Element "${elementName}" is now visible`);
        } catch (error) {
            logger.error(`Element "${elementName}" did not become visible within ${timeoutMs}ms`, error);
            throw new Error(`Element "${elementName}" in page "${pageClassName}" did not become visible within ${timeoutMs}ms`);
        }
    }

    /**
     * Verifies that an element contains specific text
     * @param elementName The name of the element to check
     * @param pageClassName The page class containing the element
     * @param expectedText The text to verify
     * @returns Promise resolving to true if the element contains the expected text
     */
    async elementContainsText(elementName: string, pageClassName: string, expectedText: string): Promise<boolean> {
        const element = await this.loadWebElement(elementName, pageClassName);
        const actualText = await element.getText();
        
        const containsText = actualText.includes(expectedText);
        logger.info(`Element "${elementName}" ${containsText ? 'contains' : 'does not contain'} text "${expectedText}"`);
        
        return containsText;
    }

    /**
     * Verifies that an element has a specific attribute value
     * @param elementName The name of the element to check
     * @param pageClassName The page class containing the element
     * @param attributeName The name of the attribute to check
     * @param expectedValue The expected value of the attribute
     * @returns Promise resolving to true if the attribute has the expected value
     */
    async elementHasAttributeValue(elementName: string, pageClassName: string, attributeName: string, expectedValue: string): Promise<boolean> {
        const element = await this.loadWebElement(elementName, pageClassName);
        const actualValue = await element.getAttribute(attributeName);
        
        const hasValue = actualValue === expectedValue;
        logger.info(`Element "${elementName}" attribute "${attributeName}" ${hasValue ? 'has' : 'does not have'} value "${expectedValue}"`);
        
        return hasValue;
    }

    /**
     * Verifies the number of elements in a list
     * @param elementsName The name of the elements list
     * @param pageClassName The page class containing the elements list
     * @param expectedCount The expected number of elements
     * @returns Promise resolving to true if the count matches
     */
    async verifyElementCount(elementsName: string, pageClassName: string, expectedCount: number): Promise<boolean> {
        const elements = await this.loadWebElements(elementsName, pageClassName);
        const actualCount = elements.length;
        
        const countMatches = actualCount === expectedCount;
        logger.info(`Elements "${elementsName}" count is ${actualCount}, expected ${expectedCount}`);
        
        return countMatches;
    }
}

// Step definitions
const getStepsInstance = (world: TestWorld) => {
    return new MobileAssertSteps(world);
};

// Visibility steps
Then('the {string} element in the {string} page should be visible', async function(this: TestWorld, elementName: string, pageClassName: string) {
    const isVisible = await getStepsInstance(this).isElementVisible(elementName, pageClassName);
    if (!isVisible) {
        throw new Error(`Element "${elementName}" in page "${pageClassName}" is not visible`);
    }
});

Then('the {string} element in the {string} page should not be visible', async function(this: TestWorld, elementName: string, pageClassName: string) {
    const isVisible = await getStepsInstance(this).isElementVisible(elementName, pageClassName);
    if (isVisible) {
        throw new Error(`Element "${elementName}" in page "${pageClassName}" is visible but should not be`);
    }
});

// Wait steps
When('I wait for the {string} element in the {string} page to be visible', async function(this: TestWorld, elementName: string, pageClassName: string) {
    await getStepsInstance(this).waitForElementVisible(elementName, pageClassName);
});

When('I wait for the {string} element in the {string} page to be visible within {int} milliseconds', 
    async function(this: TestWorld, elementName: string, pageClassName: string, timeoutMs: number) {
        await getStepsInstance(this).waitForElementVisible(elementName, pageClassName, timeoutMs);
});

// Text verification steps
Then('the {string} element in the {string} page should contain text {string}', 
    async function(this: TestWorld, elementName: string, pageClassName: string, expectedText: string) {
        const containsText = await getStepsInstance(this).elementContainsText(elementName, pageClassName, expectedText);
        if (!containsText) {
            throw new Error(`Element "${elementName}" in page "${pageClassName}" does not contain text "${expectedText}"`);
        }
});

// Attribute verification steps
Then('the {string} element in the {string} page should have attribute {string} with value {string}', 
    async function(this: TestWorld, elementName: string, pageClassName: string, attributeName: string, expectedValue: string) {
        const hasValue = await getStepsInstance(this).elementHasAttributeValue(elementName, pageClassName, attributeName, expectedValue);
        if (!hasValue) {
            throw new Error(`Element "${elementName}" in page "${pageClassName}" does not have attribute "${attributeName}" with value "${expectedValue}"`);
        }
});

// Element count steps
Then('the {string} elements in the {string} page should have count {int}', 
    async function(this: TestWorld, elementsName: string, pageClassName: string, expectedCount: number) {
        const countMatches = await getStepsInstance(this).verifyElementCount(elementsName, pageClassName, expectedCount);
        if (!countMatches) {
            throw new Error(`Elements "${elementsName}" in page "${pageClassName}" do not have the expected count ${expectedCount}`);
        }
});
