import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { MobileBaseSetup } from './mobileBaseSetup';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('MobileClickSteps');

/**
 * Mobile click step definitions for tapping and clicking mobile elements
 */
export class MobileClickSteps extends MobileBaseSetup {
    constructor(world: TestWorld) {
        super(world);
    }

    /**
     * Taps on a mobile element by its name
     * @param elementName The name of the element to tap
     */
    async tapOnElement(elementName: string, pageClassName: string): Promise<void> {
        const element = await this.loadWebElement(elementName, pageClassName);
        await element.click();
        logger.info(`Tapped on element: ${elementName} in page: ${pageClassName}`);
    }

    /**
     * Check if the current driver is for iOS
     * @returns boolean indicating if the driver is for iOS
     */
    private isIOS(): boolean {
        try {
            // Look for iOS-specific properties in the capabilities
            const caps = this.driver.capabilities as any;
            return caps && (
                (caps['appium:platformName'] === 'iOS') ||
                (caps.platformName === 'iOS') || 
                (typeof caps.deviceName === 'string' && 
                 (caps.deviceName.includes('iPhone') || caps.deviceName.includes('iPad')))
            );
        } catch (e) {
            logger.warn('Error determining platform type', e);
            return false;
        }
    }

    /**
     * Taps on a mobile element by its text
     * @param text The text of the element to tap
     */
    async tapOnElementWithText(text: string): Promise<void> {
        let element;
        
        if (this.isIOS()) {
            element = await this.driver.$(`-ios predicate string:name == "${text}" OR label == "${text}" OR value == "${text}"`);
        } else {
            // Android
            element = await this.driver.$(`android=new UiSelector().text("${text}")`);
        }
        
        await element.click();
        logger.info(`Tapped on element with text: ${text}`);
    }

    /**
     * Double taps on a mobile element
     * @param elementName The name of the element to double tap
     * @param pageClassName The page class containing the element
     */
    async doubleTapOnElement(elementName: string, pageClassName: string): Promise<void> {
        const element = await this.loadWebElement(elementName, pageClassName);
        
        if (this.isIOS()) {
            // For iOS, we use touchAction for double tap
            const location = await element.getLocation();
            await this.driver.touchAction([
                { action: 'tap', x: location.x + 10, y: location.y + 10 },
                { action: 'wait', ms: 100 },
                { action: 'tap', x: location.x + 10, y: location.y + 10 }
            ]);
        } else {
            // For Android, we can use the tap command with count=2
            const size = await element.getSize();
            const location = await element.getLocation();
            const centerX = location.x + (size.width / 2);
            const centerY = location.y + (size.height / 2);
            
            await this.driver.touchAction([
                { action: 'tap', x: centerX, y: centerY },
                { action: 'wait', ms: 100 },
                { action: 'tap', x: centerX, y: centerY }
            ]);
        }
        
        logger.info(`Double tapped on element: ${elementName} in page: ${pageClassName}`);
    }

    /**
     * Long presses on a mobile element
     * @param elementName The name of the element to long press
     * @param pageClassName The page class containing the element
     * @param duration The duration of the long press in milliseconds
     */
    async longPressOnElement(elementName: string, pageClassName: string, duration: number = 1000): Promise<void> {
        const element = await this.loadWebElement(elementName, pageClassName);
        
        // Get element location
        const location = await element.getLocation();
        const size = await element.getSize();
        const centerX = location.x + (size.width / 2);
        const centerY = location.y + (size.height / 2);
        
        // Use touchAction with longPress
        await this.driver.touchAction([
            { action: 'press', x: centerX, y: centerY },
            { action: 'wait', ms: duration },
            { action: 'release' }
        ]);
        
        logger.info(`Long pressed on element: ${elementName} in page: ${pageClassName} for ${duration}ms`);
    }
}

// Step definitions
const getStepsInstance = (world: TestWorld) => {
    return new MobileClickSteps(world);
};

When('I tap on the {string} element in the {string} page', async function(this: TestWorld, elementName: string, pageClassName: string) {
    await getStepsInstance(this).tapOnElement(elementName, pageClassName);
});

When('I tap on the element with text {string}', async function(this: TestWorld, text: string) {
    await getStepsInstance(this).tapOnElementWithText(text);
});

When('I double tap on the {string} element in the {string} page', async function(this: TestWorld, elementName: string, pageClassName: string) {
    await getStepsInstance(this).doubleTapOnElement(elementName, pageClassName);
});

When('I long press on the {string} element in the {string} page for {int} milliseconds', async function(this: TestWorld, elementName: string, pageClassName: string, duration: number) {
    await getStepsInstance(this).longPressOnElement(elementName, pageClassName, duration);
});

When('I long press on the {string} element in the {string} page', async function(this: TestWorld, elementName: string, pageClassName: string) {
    await getStepsInstance(this).longPressOnElement(elementName, pageClassName);
});
