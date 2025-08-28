import { injectable } from 'tsyringe';
import { Logger } from '../../core/utils/logger';
import { ConfigManager } from '../../core/utils/config-manager';

/**
 * Base page class that all page objects should extend
 * Provides common functionality for interacting with elements
 */
// We can't use @injectable() on an abstract class with TypeScript
export abstract class BasePage {
  protected driver: WebdriverIO.Browser;
  protected logger: Logger;
  protected configManager: ConfigManager;
  
  /**
   * Create a new page instance
   * @param driver WebdriverIO Browser instance
   */
  constructor(driver: WebdriverIO.Browser) {
    this.driver = driver;
    this.logger = new Logger(this.constructor.name);
    this.configManager = new ConfigManager();
  }
  
  /**
   * Get the page's URL or app screen identifier
   * Should be implemented by subclasses
   */
  abstract get pageIdentifier(): string;
  
  /**
   * Wait for the page to be fully loaded
   * @param timeout Maximum wait time in milliseconds
   */
  async waitForPageLoaded(timeout = 10000): Promise<void> {
    this.logger.info(`Waiting for page to be loaded: ${this.pageIdentifier}`);
    await this.driver.waitUntil(
      async () => await this.isPageLoaded(),
      {
        timeout,
        timeoutMsg: `Page ${this.pageIdentifier} did not load within ${timeout}ms`
      }
    );
  }
  
  /**
   * Check if the page is currently loaded
   * Can be overridden by subclasses for custom validation
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      // Basic implementation that can be overridden by subclasses
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Find an element on the page
   * @param selector Element selector
   * @returns WebdriverIO Element
   */
  async findElement(selector: string): Promise<WebdriverIO.Element> {
    this.logger.debug(`Finding element: ${selector}`);
    return this.driver.$(selector);
  }
  
  /**
   * Find all elements matching a selector on the page
   * @param selector Element selector
   * @returns Array of WebdriverIO Elements
   */
  async findElements(selector: string): Promise<WebdriverIO.ElementArray> {
    this.logger.debug(`Finding all elements: ${selector}`);
    return await this.driver.$$(selector) as any;
  }
  
  /**
   * Click on an element
   * @param selector Element selector
   */
  async click(selector: string): Promise<void> {
    this.logger.debug(`Clicking on element: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitForDisplayed();
    await element.click();
  }
  
  /**
   * Type text into an input field
   * @param selector Element selector
   * @param text Text to type
   */
  async sendKeys(selector: string, text: string): Promise<void> {
    this.logger.debug(`Typing "${text}" into element: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitForDisplayed();
    await element.clearValue();
    await element.setValue(text);
  }
  
  /**
   * Get the current platform (android or ios)
   * @returns Platform name as string
   */
  async getPlatform(): Promise<string> {
    try {
      const capabilities = await this.driver.capabilities as any;
      const platformName = capabilities.platformName || 
                          capabilities['appium:platformName'] || 
                          this.configManager.get<string>('platform', 'android');
      return (platformName as string).toLowerCase();
    } catch (error) {
      this.logger.error('Error determining platform', error);
      return 'android'; // Default to Android if we can't detect
    }
  }
  
  /**
   * Get text from an element
   * @param selector Element selector
   * @returns Element text content
   */
  async getText(selector: string): Promise<string> {
    this.logger.debug(`Getting text from element: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitForDisplayed();
    return element.getText();
  }
  
  /**
   * Check if an element is displayed
   * @param selector Element selector
   * @returns True if element is displayed
   */
  async isDisplayed(selector: string): Promise<boolean> {
    this.logger.debug(`Checking if element is displayed: ${selector}`);
    try {
      const element = await this.findElement(selector);
      return element.isDisplayed();
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Wait for an element to be displayed
   * @param selector Element selector
   * @param timeout Maximum wait time in milliseconds
   */
  async waitForDisplayed(selector: string, timeout = 10000): Promise<void> {
    this.logger.debug(`Waiting for element to be displayed: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitForDisplayed({ timeout });
  }
  
  /**
   * Wait for an element to be clickable
   * @param selector Element selector
   * @param timeout Maximum wait time in milliseconds
   */
  async waitForClickable(selector: string, timeout = 10000): Promise<void> {
    this.logger.debug(`Waiting for element to be clickable: ${selector}`);
    const element = await this.findElement(selector);
    await element.waitForClickable({ timeout });
  }
  
  /**
   * Scroll until an element is visible
   * @param selector Element selector
   */
  async scrollIntoView(selector: string): Promise<void> {
    this.logger.debug(`Scrolling element into view: ${selector}`);
    const element = await this.findElement(selector);
    await element.scrollIntoView();
  }
  
  /**
   * Take a screenshot of the current page
   * @param name Screenshot name
   * @returns Path to the saved screenshot
   */
  async takeScreenshot(name: string): Promise<string> {
    this.logger.debug(`Taking screenshot: ${name}`);
    const screenshotPath = `./screenshots/${name}-${Date.now()}.png`;
    await this.driver.saveScreenshot(screenshotPath);
    return screenshotPath;
  }
  
  /**
   * Swipe on the screen (for mobile testing)
   * @param direction Direction to swipe: 'up', 'down', 'left', or 'right'
   * @param percentage Amount of screen to swipe (0.0 to 1.0)
   */
  async swipe(direction: 'up' | 'down' | 'left' | 'right', percentage = 0.5): Promise<void> {
    this.logger.debug(`Swiping ${direction} with percentage ${percentage}`);
    
    // Get screen size
    const { width, height } = await this.driver.getWindowRect();
    
    // Calculate start and end points based on direction and percentage
    let startX: number, startY: number, endX: number, endY: number;
    
    switch (direction) {
      case 'up':
        startX = width / 2;
        endX = width / 2;
        startY = height * 0.8;
        endY = height * (0.8 - percentage);
        break;
      case 'down':
        startX = width / 2;
        endX = width / 2;
        startY = height * 0.2;
        endY = height * (0.2 + percentage);
        break;
      case 'left':
        startX = width * 0.8;
        endX = width * (0.8 - percentage);
        startY = height / 2;
        endY = height / 2;
        break;
      case 'right':
        startX = width * 0.2;
        endX = width * (0.2 + percentage);
        startY = height / 2;
        endY = height / 2;
        break;
    }
    
    // Perform the swipe gesture
    await this.driver.touchAction([
      { action: 'press', x: startX, y: startY },
      { action: 'wait', ms: 100 },
      { action: 'moveTo', x: endX, y: endY },
      { action: 'release' }
    ]);
  }
}
