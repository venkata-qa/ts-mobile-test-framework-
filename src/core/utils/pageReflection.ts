import { Logger } from './logger';

/**
 * Utility class to support reflection-like dynamic page object handling in TypeScript
 * Inspired by the Java implementation's reflection capabilities
 */
export class PageReflection {
  private static logger = new Logger('PageReflection');
  private static pageObjectsCache: { [key: string]: any } = {};
  
  /**
   * Import and instantiate a page object class dynamically
   * @param pageClassName Name of the page class
   * @param driver WebdriverIO browser instance
   * @returns Instance of the requested page object
   */
  static async getPageObject(pageClassName: string, driver: WebdriverIO.Browser): Promise<any> {
    PageReflection.logger.debug(`Loading page object: ${pageClassName}`);
    
    try {
      // Check cache first
      if (!PageReflection.pageObjectsCache[pageClassName]) {
        // Use a more direct approach with require instead of import
        try {
          // Try different paths since the import is failing
          const paths = [
            `../../../ui/pageObjects/${pageClassName}`,
            `../../ui/pageObjects/${pageClassName}`,
            `../ui/pageObjects/${pageClassName}`
          ];
          
          let pageModule = null;
          for (const path of paths) {
            try {
              // Use dynamic import for compatibility
              pageModule = await import(path);
              PageReflection.logger.info(`Successfully loaded ${pageClassName} from path: ${path}`);
              break;
            } catch (e) {
              PageReflection.logger.debug(`Failed to load from path: ${path}`);
            }
          }
          
          if (pageModule) {
            PageReflection.pageObjectsCache[pageClassName] = pageModule;
          } else {
            throw new Error(`Could not find module in any path`);
          }
        } catch (error) {
          PageReflection.logger.error(`Failed to import page object class: ${pageClassName}`, error);
          throw new Error(`Page class not found: ${pageClassName}`);
        }
      }
      
      // Get the class constructor from the imported module
      const PageClass = PageReflection.pageObjectsCache[pageClassName][pageClassName];
      
      if (!PageClass) {
        throw new Error(`Class ${pageClassName} not found in module`);
      }
      
      // Instantiate the page object with driver
      return new PageClass(driver);
    } catch (error) {
      PageReflection.logger.error(`Error loading page object: ${pageClassName}`, error);
      throw error;
    }
  }
  
  /**
   * Find an element or property from a page object by name
   * @param elementName Name of the element or property
   * @param pageObject Page object instance
   * @returns The requested element or property value
   */
  static getElementFromPage(elementName: string, pageObject: any): any {
    PageReflection.logger.debug(`Getting element: ${elementName} from page: ${pageObject.constructor.name}`);
    
    try {
      // Check if it's a property getter
      if (typeof pageObject[`get${this.capitalizeFirstLetter(elementName)}`] === 'function') {
        return pageObject[`get${this.capitalizeFirstLetter(elementName)}`]();
      }
      
      // Check if it's a direct property
      if (elementName in pageObject) {
        return pageObject[elementName];
      }
      
      // Check if there's an elements property (common pattern for page objects)
      if (typeof pageObject.elements === 'function' || typeof pageObject.elements === 'object') {
        const elements = typeof pageObject.elements === 'function' ? pageObject.elements() : pageObject.elements;
        if (elements && elementName in elements) {
          return elements[elementName];
        }
      }
      
      // Try to get via a getter method if it exists
      const getterMethodName = `get${this.capitalizeFirstLetter(elementName)}`;
      if (typeof pageObject[getterMethodName] === 'function') {
        return pageObject[getterMethodName]();
      }
      
      throw new Error(`Element "${elementName}" not found in page object "${pageObject.constructor.name}"`);
    } catch (error) {
      PageReflection.logger.error(`Error getting element: ${elementName}`, error);
      throw error;
    }
  }

  /**
   * Helper method to capitalize the first letter of a string
   */
  private static capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
