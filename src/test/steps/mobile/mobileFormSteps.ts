import { When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { MobileBaseSetup } from './mobileBaseSetup';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('MobileFormSteps');

/**
 * Mobile form step definitions
 * Provides steps for interacting with input fields, checkboxes, radio buttons, etc.
 */
export class MobileFormSteps extends MobileBaseSetup {
    constructor(world: TestWorld) {
        super(world);
    }

    /**
     * Types text into an input field
     * @param elementName The name of the element to type into
     * @param pageClassName The page class containing the element
     * @param text The text to type
     */
    async typeIntoField(elementName: string, pageClassName: string, text: string): Promise<void> {
        const element = await this.loadWebElement(elementName, pageClassName);
        
        try {
            // Clear the field first
            await element.clearValue();
            // Type the text
            await element.setValue(text);
            logger.info(`Typed text "${text}" into element "${elementName}" in page "${pageClassName}"`);
        } catch (error) {
            logger.error(`Error typing text into element "${elementName}"`, error);
            throw error;
        }
    }

    /**
     * Clears the text from an input field
     * @param elementName The name of the element to clear
     * @param pageClassName The page class containing the element
     */
    async clearField(elementName: string, pageClassName: string): Promise<void> {
        const element = await this.loadWebElement(elementName, pageClassName);
        
        try {
            await element.clearValue();
            logger.info(`Cleared text from element "${elementName}" in page "${pageClassName}"`);
        } catch (error) {
            logger.error(`Error clearing text from element "${elementName}"`, error);
            throw error;
        }
    }

    /**
     * Toggles a checkbox or radio button
     * @param elementName The name of the element to toggle
     * @param pageClassName The page class containing the element
     * @param shouldBeChecked Whether the element should be checked (true) or unchecked (false)
     */
    async toggleCheckbox(elementName: string, pageClassName: string, shouldBeChecked: boolean): Promise<void> {
        const element = await this.loadWebElement(elementName, pageClassName);
        
        try {
            const isSelected = await element.isSelected();
            
            // Only click if the current state doesn't match the desired state
            if (isSelected !== shouldBeChecked) {
                await element.click();
                logger.info(`${shouldBeChecked ? 'Checked' : 'Unchecked'} the element "${elementName}" in page "${pageClassName}"`);
            } else {
                logger.info(`Element "${elementName}" in page "${pageClassName}" is already ${shouldBeChecked ? 'checked' : 'unchecked'}`);
            }
        } catch (error) {
            logger.error(`Error toggling element "${elementName}"`, error);
            throw error;
        }
    }

    /**
     * Selects an option from a dropdown/picker
     * @param elementName The name of the dropdown element
     * @param pageClassName The page class containing the element
     * @param optionText The text of the option to select
     */
    async selectOption(elementName: string, pageClassName: string, optionText: string): Promise<void> {
        const element = await this.loadWebElement(elementName, pageClassName);
        
        try {
            // First, tap the dropdown to open it
            await element.click();
            logger.info(`Tapped on dropdown element "${elementName}" in page "${pageClassName}"`);
            
            // Now find and tap the option with the given text
            // This is platform-specific
            // Check platform by examining capabilities
            const caps = this.driver.capabilities as any;
            const isIOS = caps && (
                (caps['appium:platformName'] === 'iOS') ||
                (caps.platformName === 'iOS') || 
                (typeof caps.deviceName === 'string' && 
                 (caps.deviceName.includes('iPhone') || caps.deviceName.includes('iPad')))
            );
            
            let optionElement;
            if (isIOS) {
                // For iOS, use predicate string to find the picker wheel option
                optionElement = await this.driver.$(`-ios predicate string:name == "${optionText}" OR label == "${optionText}" OR value == "${optionText}"`);
            } else {
                // For Android, use UiSelector to find the option
                optionElement = await this.driver.$(`android=new UiSelector().text("${optionText}")`);
            }
            
            await optionElement.click();
            logger.info(`Selected option "${optionText}" from dropdown "${elementName}" in page "${pageClassName}"`);
        } catch (error) {
            logger.error(`Error selecting option "${optionText}" from dropdown "${elementName}"`, error);
            throw error;
        }
    }

    /**
     * Gets the text value of a form field
     * @param elementName The name of the element to get text from
     * @param pageClassName The page class containing the element
     * @returns The text value of the element
     */
    async getFieldValue(elementName: string, pageClassName: string): Promise<string> {
        const element = await this.loadWebElement(elementName, pageClassName);
        
        try {
            // Try getting the text first
            let value = await element.getText();
            
            // If text is empty, try getting the value attribute
            if (!value) {
                value = await element.getAttribute('value') || '';
            }
            
            logger.info(`Got value "${value}" from element "${elementName}" in page "${pageClassName}"`);
            return value;
        } catch (error) {
            logger.error(`Error getting value from element "${elementName}"`, error);
            throw error;
        }
    }
}

// Step definitions
const getStepsInstance = (world: TestWorld) => {
    return new MobileFormSteps(world);
};

// Input field steps
When('I type {string} into the {string} field in the {string} page', 
    async function(this: TestWorld, text: string, elementName: string, pageClassName: string) {
        await getStepsInstance(this).typeIntoField(elementName, pageClassName, text);
});

When('I clear the {string} field in the {string} page', 
    async function(this: TestWorld, elementName: string, pageClassName: string) {
        await getStepsInstance(this).clearField(elementName, pageClassName);
});

// Checkbox/radio button steps
When('I check the {string} checkbox in the {string} page', 
    async function(this: TestWorld, elementName: string, pageClassName: string) {
        await getStepsInstance(this).toggleCheckbox(elementName, pageClassName, true);
});

When('I uncheck the {string} checkbox in the {string} page', 
    async function(this: TestWorld, elementName: string, pageClassName: string) {
        await getStepsInstance(this).toggleCheckbox(elementName, pageClassName, false);
});

// Dropdown/picker steps
When('I select {string} from the {string} dropdown in the {string} page', 
    async function(this: TestWorld, optionText: string, elementName: string, pageClassName: string) {
        await getStepsInstance(this).selectOption(elementName, pageClassName, optionText);
});

// Field value verification steps
Then('the {string} field in the {string} page should have value {string}', 
    async function(this: TestWorld, elementName: string, pageClassName: string, expectedValue: string) {
        const actualValue = await getStepsInstance(this).getFieldValue(elementName, pageClassName);
        if (actualValue !== expectedValue) {
            throw new Error(`Field "${elementName}" in page "${pageClassName}" has value "${actualValue}", expected "${expectedValue}"`);
        }
});
