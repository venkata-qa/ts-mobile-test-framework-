import { When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { MobileBaseSetup } from './mobileBaseSetup';
import { Logger } from '../../../core/utils/logger';

const logger = new Logger('MobileSwipeSteps');

/**
 * Mobile swipe step definitions
 * Provides steps for swiping, scrolling, and other gesture-based interactions
 */
export class MobileSwipeSteps extends MobileBaseSetup {
    constructor(world: TestWorld) {
        super(world);
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
     * Swipes from one point to another on the screen
     * @param startX X-coordinate of the starting point
     * @param startY Y-coordinate of the starting point
     * @param endX X-coordinate of the ending point
     * @param endY Y-coordinate of the ending point
     * @param durationMs Duration of the swipe in milliseconds
     */
    async swipe(startX: number, startY: number, endX: number, endY: number, durationMs: number = 500): Promise<void> {
        try {
            await this.driver.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'wait', ms: durationMs },
                { action: 'moveTo', x: endX, y: endY },
                { action: 'release' }
            ]);
            logger.info(`Swiped from (${startX}, ${startY}) to (${endX}, ${endY}) with duration ${durationMs}ms`);
        } catch (error) {
            logger.error('Error performing swipe action', error);
            throw error;
        }
    }

    /**
     * Swipes in a given direction
     * @param direction The direction to swipe in (up, down, left, right)
     * @param percentage The percentage of the screen to swipe across (default: 50%)
     */
    async swipeInDirection(direction: 'up' | 'down' | 'left' | 'right', percentage: number = 50): Promise<void> {
        try {
            // Get screen dimensions
            const dimensions = await this.driver.getWindowSize();
            const screenWidth = dimensions.width;
            const screenHeight = dimensions.height;
            
            // Calculate swipe coordinates based on screen dimensions and direction
            const percentageValue = percentage / 100;
            const offset = 10; // Slight offset from the edges
            
            let startX: number, startY: number, endX: number, endY: number;
            
            switch (direction) {
                case 'up':
                    startX = screenWidth / 2;
                    startY = screenHeight * (1 - percentageValue) - offset;
                    endX = screenWidth / 2;
                    endY = screenHeight * percentageValue + offset;
                    break;
                case 'down':
                    startX = screenWidth / 2;
                    startY = screenHeight * percentageValue + offset;
                    endX = screenWidth / 2;
                    endY = screenHeight * (1 - percentageValue) - offset;
                    break;
                case 'left':
                    startX = screenWidth * (1 - percentageValue) - offset;
                    startY = screenHeight / 2;
                    endX = screenWidth * percentageValue + offset;
                    endY = screenHeight / 2;
                    break;
                case 'right':
                    startX = screenWidth * percentageValue + offset;
                    startY = screenHeight / 2;
                    endX = screenWidth * (1 - percentageValue) - offset;
                    endY = screenHeight / 2;
                    break;
                default:
                    throw new Error(`Invalid swipe direction: ${direction}`);
            }
            
            await this.swipe(startX, startY, endX, endY);
            logger.info(`Swiped ${direction} by ${percentage}%`);
        } catch (error) {
            logger.error(`Error swiping ${direction}`, error);
            throw error;
        }
    }

    /**
     * Scrolls to find an element with specific text
     * @param text The text to scroll to
     * @param direction The direction to scroll in (default: down)
     * @param maxSwipes Maximum number of swipes to attempt (default: 10)
     * @returns true if the element was found, false otherwise
     */
    async scrollToText(text: string, direction: 'up' | 'down' = 'down', maxSwipes: number = 10): Promise<boolean> {
        logger.info(`Scrolling to find text: "${text}"`);
        
        try {
            // Try to find the element first without scrolling
            let element;
            if (this.isIOS()) {
                element = await this.driver.$(`-ios predicate string:name CONTAINS "${text}" OR label CONTAINS "${text}" OR value CONTAINS "${text}"`);
            } else {
                element = await this.driver.$(`android=new UiSelector().textContains("${text}")`);
            }
            
            // If the element is displayed, we found it
            if (await element.isDisplayed()) {
                logger.info(`Found text "${text}" without scrolling`);
                return true;
            }
            
            // Otherwise, start scrolling to find it
            let found = false;
            let swipes = 0;
            
            while (!found && swipes < maxSwipes) {
                // Swipe in the specified direction
                await this.swipeInDirection(direction, 30);
                swipes++;
                
                // Try to find the element after swiping
                if (this.isIOS()) {
                    element = await this.driver.$(`-ios predicate string:name CONTAINS "${text}" OR label CONTAINS "${text}" OR value CONTAINS "${text}"`);
                } else {
                    element = await this.driver.$(`android=new UiSelector().textContains("${text}")`);
                }
                
                // Check if element is visible
                try {
                    found = await element.isDisplayed();
                } catch (e) {
                    // Element not found yet
                    found = false;
                }
                
                if (found) {
                    logger.info(`Found text "${text}" after ${swipes} swipes`);
                    return true;
                }
            }
            
            logger.warn(`Text "${text}" not found after ${maxSwipes} swipes`);
            return false;
        } catch (error) {
            logger.error(`Error scrolling to text "${text}"`, error);
            throw error;
        }
    }

    /**
     * Scrolls to find an element by name
     * @param elementName The name of the element to scroll to
     * @param pageClassName The page class containing the element
     * @param direction The direction to scroll in (default: down)
     * @param maxSwipes Maximum number of swipes to attempt (default: 10)
     * @returns true if the element was found, false otherwise
     */
    async scrollToElement(elementName: string, pageClassName: string, direction: 'up' | 'down' = 'down', maxSwipes: number = 10): Promise<boolean> {
        logger.info(`Scrolling to find element: "${elementName}" in page "${pageClassName}"`);
        
        try {
            // Try to find the element first without scrolling
            let element;
            
            try {
                element = await this.loadWebElement(elementName, pageClassName);
                if (await element.isDisplayed()) {
                    logger.info(`Found element "${elementName}" without scrolling`);
                    return true;
                }
            } catch (e) {
                // Element not found initially, which is fine
            }
            
            // Start scrolling to find it
            let found = false;
            let swipes = 0;
            
            while (!found && swipes < maxSwipes) {
                // Swipe in the specified direction
                await this.swipeInDirection(direction, 30);
                swipes++;
                
                // Try to find the element after swiping
                try {
                    element = await this.loadWebElement(elementName, pageClassName);
                    found = await element.isDisplayed();
                } catch (e) {
                    // Element not found yet
                    found = false;
                }
                
                if (found) {
                    logger.info(`Found element "${elementName}" after ${swipes} swipes`);
                    return true;
                }
            }
            
            logger.warn(`Element "${elementName}" not found after ${maxSwipes} swipes`);
            return false;
        } catch (error) {
            logger.error(`Error scrolling to element "${elementName}"`, error);
            throw error;
        }
    }
}

// Step definitions
const getStepsInstance = (world: TestWorld) => {
    return new MobileSwipeSteps(world);
};

// Swipe steps
When('I swipe {string}', async function(this: TestWorld, direction: string) {
    if (!['up', 'down', 'left', 'right'].includes(direction.toLowerCase())) {
        throw new Error(`Invalid swipe direction: ${direction}. Valid options are: up, down, left, right`);
    }
    
    await getStepsInstance(this).swipeInDirection(direction.toLowerCase() as 'up' | 'down' | 'left' | 'right');
});

When('I swipe {string} {int}%', async function(this: TestWorld, direction: string, percentage: number) {
    if (!['up', 'down', 'left', 'right'].includes(direction.toLowerCase())) {
        throw new Error(`Invalid swipe direction: ${direction}. Valid options are: up, down, left, right`);
    }
    
    await getStepsInstance(this).swipeInDirection(direction.toLowerCase() as 'up' | 'down' | 'left' | 'right', percentage);
});

// Scroll steps
When('I scroll to text {string}', async function(this: TestWorld, text: string) {
    const found = await getStepsInstance(this).scrollToText(text);
    
    if (!found) {
        throw new Error(`Text "${text}" not found after scrolling`);
    }
});

When('I scroll {string} to text {string}', async function(this: TestWorld, direction: string, text: string) {
    if (!['up', 'down'].includes(direction.toLowerCase())) {
        throw new Error(`Invalid scroll direction: ${direction}. Valid options are: up, down`);
    }
    
    const found = await getStepsInstance(this).scrollToText(text, direction.toLowerCase() as 'up' | 'down');
    
    if (!found) {
        throw new Error(`Text "${text}" not found after scrolling ${direction}`);
    }
});

When('I scroll to the {string} element in the {string} page', async function(this: TestWorld, elementName: string, pageClassName: string) {
    const found = await getStepsInstance(this).scrollToElement(elementName, pageClassName);
    
    if (!found) {
        throw new Error(`Element "${elementName}" in page "${pageClassName}" not found after scrolling`);
    }
});

When('I scroll {string} to the {string} element in the {string} page', 
    async function(this: TestWorld, direction: string, elementName: string, pageClassName: string) {
        if (!['up', 'down'].includes(direction.toLowerCase())) {
            throw new Error(`Invalid scroll direction: ${direction}. Valid options are: up, down`);
        }
        
        const found = await getStepsInstance(this).scrollToElement(
            elementName, 
            pageClassName,
            direction.toLowerCase() as 'up' | 'down'
        );
        
        if (!found) {
            throw new Error(`Element "${elementName}" in page "${pageClassName}" not found after scrolling ${direction}`);
        }
});