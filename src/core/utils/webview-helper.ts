import { Logger } from './logger';

/**
 * Helper utility for handling WebView interactions in mobile apps
 */
export class WebViewHelper {
  private logger: Logger;
  
  constructor() {
    this.logger = new Logger('WebViewHelper');
  }
  
  /**
   * Get all available contexts for the current session
   * @param driver WebdriverIO browser instance
   * @returns List of available contexts
   */
  async getContexts(driver: WebdriverIO.Browser): Promise<string[]> {
    try {
      const contexts = await driver.getContexts();
      this.logger.info(`Available contexts: ${JSON.stringify(contexts)}`);
      return contexts;
    } catch (error) {
      this.logger.error('Failed to get available contexts', error);
      throw error;
    }
  }
  
  /**
   * Switch to a specific context by index or name
   * @param driver WebdriverIO browser instance
   * @param contextIdOrName Index or name of the context to switch to
   * @returns Current context after switching
   */
  async switchContext(driver: WebdriverIO.Browser, contextIdOrName: number | string): Promise<string> {
    try {
      let contextName: string;
      
      if (typeof contextIdOrName === 'number') {
        // If a number is provided, get the context at that index
        const contexts = await this.getContexts(driver);
        if (contextIdOrName >= contexts.length) {
          throw new Error(`Invalid context index: ${contextIdOrName}, available contexts: ${contexts.length}`);
        }
        contextName = contexts[contextIdOrName];
      } else {
        // Use the provided context name
        contextName = contextIdOrName;
      }
      
      this.logger.info(`Switching to context: ${contextName}`);
      await driver.switchContext(contextName);
      
      const currentContext = await driver.getContext();
      this.logger.info(`Current context: ${currentContext}`);
      
      return String(currentContext);
    } catch (error) {
      this.logger.error(`Failed to switch context to ${contextIdOrName}`, error);
      throw error;
    }
  }
  
  /**
   * Switch to the WebView context
   * @param driver WebdriverIO browser instance
   * @returns The WebView context name that was switched to
   */
  async switchToWebView(driver: WebdriverIO.Browser): Promise<string> {
    try {
      const contexts = await this.getContexts(driver);
      
      // Find the first WebView context
      const webviewContext = contexts.find(context => context.includes('WEBVIEW'));
      
      if (!webviewContext) {
        throw new Error('No WebView context found');
      }
      
      this.logger.info(`Switching to WebView context: ${webviewContext}`);
      await driver.switchContext(webviewContext);
      
      const currentContext = await driver.getContext();
      this.logger.info(`Current context: ${currentContext}`);
      
      return String(currentContext);
    } catch (error) {
      this.logger.error('Failed to switch to WebView context', error);
      throw error;
    }
  }
  
  /**
   * Switch to the native context
   * @param driver WebdriverIO browser instance
   * @returns The native context name that was switched to
   */
  async switchToNative(driver: WebdriverIO.Browser): Promise<string> {
    try {
      this.logger.info('Switching to NATIVE_APP context');
      await driver.switchContext('NATIVE_APP');
      
      const currentContext = await driver.getContext();
      this.logger.info(`Current context: ${currentContext}`);
      
      return String(currentContext);
    } catch (error) {
      this.logger.error('Failed to switch to native context', error);
      throw error;
    }
  }
  
  /**
   * Wait for a WebView context to become available
   * @param driver WebdriverIO browser instance
   * @param timeout Timeout in milliseconds (default: 10000)
   * @returns True if WebView context was found, false otherwise
   */
  async waitForWebViewContext(driver: WebdriverIO.Browser, timeout = 10000): Promise<boolean> {
    this.logger.info(`Waiting up to ${timeout}ms for WebView context...`);
    
    const startTime = Date.now();
    let webViewFound = false;
    
    while (Date.now() - startTime < timeout && !webViewFound) {
      const contexts = await this.getContexts(driver);
      webViewFound = contexts.some(context => context.includes('WEBVIEW'));
      
      if (webViewFound) {
        this.logger.info('WebView context found');
        break;
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (!webViewFound) {
      this.logger.warn(`WebView context not found within ${timeout}ms timeout`);
    }
    
    return webViewFound;
  }
}
