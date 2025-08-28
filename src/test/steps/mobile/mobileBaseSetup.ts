import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';
import { PageReflection } from '../../../core/utils/pageReflection';

/**
 * Base setup for mobile step definitions
 * Provides reflection-like functionality to find elements similar to the Java implementation
 */
export class MobileBaseSetup {
  protected logger: Logger;
  protected driver: WebdriverIO.Browser;
  protected world: TestWorld;
  
  constructor(world: TestWorld) {
    this.world = world;
    this.driver = world.driver!;
    this.logger = new Logger(this.constructor.name);
  }
  
  /**
   * Load a WebdriverIO element using reflection-like approach
   * @param elementName The name of the element in the page object
   * @param pageClassName The name of the page object class
   * @returns WebdriverIO element
   */
  async loadWebElement(elementName: string, pageClassName: string): Promise<WebdriverIO.Element> {
    this.logger.debug(`Loading element "${elementName}" from page "${pageClassName}"`);
    
    try {
      // Get the page object instance
      const pageObject = await PageReflection.getPageObject(pageClassName, this.driver);
      
      // Get the element from the page object
      const elementSelector = PageReflection.getElementFromPage(elementName, pageObject);
      
      if (!elementSelector) {
        throw new Error(`Element "${elementName}" not found in page "${pageClassName}"`);
      }
      
      // If the result is already a WebdriverIO element, return it directly
      if (elementSelector.selector) {
        return elementSelector;
      }
      
      // Otherwise, treat it as a selector string
      return this.driver.$(elementSelector);
    } catch (error) {
      this.logger.error(`Error loading element "${elementName}" from page "${pageClassName}"`, error);
      throw error;
    }
  }
  
  /**
   * Load multiple WebdriverIO elements using reflection-like approach
   * @param elementName The name of the elements list in the page object
   * @param pageClassName The name of the page object class
   * @returns Array of WebdriverIO elements
   */
  async loadWebElements(elementName: string, pageClassName: string): Promise<WebdriverIO.Element[]> {
    this.logger.debug(`Loading elements "${elementName}" from page "${pageClassName}"`);
    
    try {
      // Get the page object instance
      const pageObject = await PageReflection.getPageObject(pageClassName, this.driver);
      
      // Get the element from the page object
      const elementSelector = PageReflection.getElementFromPage(elementName, pageObject);
      
      if (!elementSelector) {
        throw new Error(`Elements "${elementName}" not found in page "${pageClassName}"`);
      }
      
      // Always use the selector string approach to be safe with types
      return this.driver.$$(elementSelector) as unknown as WebdriverIO.Element[];
    } catch (error) {
      this.logger.error(`Error loading elements "${elementName}" from page "${pageClassName}"`, error);
      throw error;
    }
  }
  
  /**
   * Load a string variable from a page object class
   * @param variableName The name of the variable in the page object
   * @param pageClassName The name of the page object class
   * @returns The string value of the variable
   */
  async loadStringVariable(variableName: string, pageClassName: string): Promise<string> {
    this.logger.debug(`Loading string variable "${variableName}" from page "${pageClassName}"`);
    
    try {
      // Get the page object instance
      const pageObject = await PageReflection.getPageObject(pageClassName, this.driver);
      
      // Get the variable from the page object
      const value = PageReflection.getElementFromPage(variableName, pageObject);
      
      if (value === undefined || value === null) {
        throw new Error(`Variable "${variableName}" not found in page "${pageClassName}"`);
      }
      
      return String(value);
    } catch (error) {
      this.logger.error(`Error loading string variable "${variableName}" from page "${pageClassName}"`, error);
      throw error;
    }
  }
  
  /**
   * Get an element by visible text (useful for mobile element finding)
   * @param text The visible text to find
   * @returns WebdriverIO element
   */
  async getElementByVisibleText(text: string): Promise<WebdriverIO.Element> {
    const selector = await this.driver.$(`//*[@text="${text}"]`);
    return selector;
  }
}
