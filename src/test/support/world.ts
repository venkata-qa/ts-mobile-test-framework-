import { setWorldConstructor, World } from '@cucumber/cucumber';
import { inject, container } from 'tsyringe';
import { Logger } from '../../core/utils/logger';
import { ConfigManager } from '../../core/utils/config-manager';
import { DriverFactory } from '../../core/driver/driverFactory';
import { ApiClient } from '../../api/apiClient';

/**
 * Custom world configuration for Cucumber
 * Extends the base World class to provide framework-specific context
 */
export class TestWorld extends World {
  private logger: Logger;
  private configManager: ConfigManager;
  private driverFactory: DriverFactory;
  
  driver?: WebdriverIO.Browser;
  apiClient?: ApiClient;
  testData: Record<string, any> = {};
  tags: string[] = [];
  
  constructor(options: any) {
    super(options);
    this.logger = new Logger('TestWorld');
    this.configManager = new ConfigManager();
    this.driverFactory = new DriverFactory();
  }
  
  /**
   * Initialize the mobile driver
   * @param platform Optional platform override (android or ios)
   * @param capabilities Optional capabilities override
   */
  async initMobileDriver(
    platform?: 'android' | 'ios', 
    capabilities?: Record<string, any>
  ): Promise<void> {
    try {
      this.logger.info(`Initializing mobile driver for ${platform || 'default platform'}`);
      
      // Check if we're running on BrowserStack
      const isBrowserStack = process.env.ENV === 'browserstack';
      
      if (isBrowserStack) {
        this.logger.info('Using BrowserStack configuration');
        
        // Get BrowserStack app ID from environment variables
        const appId = process.env.BROWSERSTACK_APP_ID;
        
        // Set proper BrowserStack capabilities
        const bsCapabilities = {
          'platformName': platform === 'ios' ? 'iOS' : 'Android',
          'appium:deviceName': process.env.DEVICE_NAME || (platform === 'ios' ? 'iPhone 14' : 'Google Pixel 7'),
          'appium:platformVersion': process.env.PLATFORM_VERSION || (platform === 'ios' ? '16' : '13.0'),
          'appium:app': appId,
          'bstack:options': {
            'userName': process.env.BROWSERSTACK_USERNAME,
            'accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
            'projectName': 'Mobile Test Framework',
            'buildName': 'Mobile Tests ' + new Date().toISOString(),
            'sessionName': `${platform} Test`,
            'debug': true,
            'networkLogs': true
          }
        };
        
        this.driver = await this.driverFactory.createDriver(platform, bsCapabilities);
      } else {
        // Default local driver creation
        this.driver = await this.driverFactory.createDriver(platform, capabilities);
      }
      
      this.logger.info('Mobile driver initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize mobile driver', error);
      throw error;
    }
  }
  
  /**
   * Initialize iOS driver directly with specific capabilities
   * This method creates a direct WebdriverIO session bypassing the framework's
   * configuration layers that might be causing issues
   * @param capabilities The exact capabilities to use
   */
  async initIOSDriverDirect(capabilities: Record<string, any>): Promise<void> {
    try {
      this.logger.info('Initializing direct iOS driver with specific capabilities');
      
      // Import webdriverio dynamically to avoid TypeScript errors
      const webdriverio = require('webdriverio');
      
      // Create a direct WebdriverIO session with our exact capabilities
      const driver = await webdriverio.remote({
        logLevel: 'info',
        hostname: 'localhost',
        port: 4723,
        path: '/',
        capabilities
      });
      
      // Set implicit wait timeout
      await driver.setTimeout({ 
        implicit: this.configManager.get<number>('implicitTimeout', 10000) 
      });
      
      // Assign to this.driver after initialization
      this.driver = driver;
      
      this.logger.info('Direct iOS driver initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize direct iOS driver', error);
      throw error;
    }
  }
  
  /**
   * Initialize the API client
   * @param baseUrl Optional base URL to set
   */
  initApiClient(baseUrl?: string): void {
    this.logger.info('Initializing API client');
    this.apiClient = new ApiClient();
    
    // If a baseUrl is provided or stored in test data, set it
    const url = baseUrl || this.getTestData<string>('baseUrl');
    if (url) {
      this.apiClient.setBaseUrl(url);
      this.logger.info(`Set API base URL to: ${url}`);
    }
    
    this.logger.info('API client initialized successfully');
  }
  
  /**
   * Store data to be shared across steps
   * @param key The key to store the data under
   * @param value The value to store
   */
  setTestData(key: string, value: any): void {
    this.testData[key] = value;
    this.logger.debug(`Set test data: ${key}`, value);
  }
  
  /**
   * Retrieve stored test data
   * @param key The key to retrieve
   * @returns The stored value, or undefined if not found
   */
  getTestData<T>(key: string): T | undefined {
    return this.testData[key] as T;
  }
  
    /**
   * Take a screenshot and attach to the current scenario
   * Extensively optimized for Allure reporting with multiple attachment methods
   * @param name Screenshot name
   */
  async takeScreenshot(name: string): Promise<string | undefined> {
    if (!this.driver) {
      this.logger.error('Cannot take screenshot - driver not initialized');
      return undefined;
    }
    
    try {
      const fs = require('fs');
      const path = require('path');
      const crypto = require('crypto');
      
      // Take screenshot
      const screenshotBase64 = await this.driver.takeScreenshot();
      
      // Attach to Cucumber World for display in standard reports
      this.attach(screenshotBase64, 'image/png;base64');
      
      // Ensure allure-results directory exists
      const allureDir = path.resolve(process.cwd(), 'allure-results');
      if (!fs.existsSync(allureDir)) {
        fs.mkdirSync(allureDir, { recursive: true });
      }
      
      // Create a strong UUID for the screenshot based on content hash + timestamp
      const contentHash = crypto.createHash('md5').update(screenshotBase64).digest('hex').substring(0, 8);
      const timestamp = Date.now();
      const uuid = `${timestamp}-${contentHash}`;
      
      // Clean filename for the screenshot - ensure it's filesystem safe
      const safeName = name
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
        .substring(0, 50); // Keep filename reasonable length
      
      // Create screenshot filename with timestamp for uniqueness and sorting
      const screenshotFileName = `${safeName}-${timestamp}.png`;
      const screenshotPath = path.join(allureDir, screenshotFileName);
      
      // Save the actual screenshot
      const screenshotBuffer = Buffer.from(screenshotBase64, 'base64');
      fs.writeFileSync(screenshotPath, screenshotBuffer);
      
      // ============ ALLURE ATTACHMENT APPROACH #1: Properties file ============
      // Create the special Allure attachment properties file
      const attachmentPropertiesContent = [
        `name=${name}`,
        'type=image/png',
        'source=true',
        `uuid=${uuid}`
      ].join('\n');
      
      fs.writeFileSync(`${screenshotPath}.properties`, attachmentPropertiesContent);
      
      // ============ ALLURE ATTACHMENT APPROACH #2: JSON file ============
      // Create special Allure attachment JSON file (alternate method)
      const attachmentJson = {
        name: name,
        source: screenshotFileName,
        type: 'image/png',
        uuid: uuid
      };
      
      // Write two copies - one with uuid prefix and one with consistent name
      fs.writeFileSync(
        path.join(allureDir, `${uuid}-attachment.json`),
        JSON.stringify(attachmentJson, null, 2)
      );
      
      fs.writeFileSync(
        path.join(allureDir, `attachment-${screenshotFileName}.json`),
        JSON.stringify(attachmentJson, null, 2)
      );
      
      // ============ ALLURE ATTACHMENT APPROACH #3: Executive Info ============
      // Write metadata about this attachment for the executor info file
      const testUuid = this.getTestData<string>('testUuid');
      if (testUuid) {
        try {
          // Path to store test-to-attachment mappings
          const mappingsPath = path.join(allureDir, `test-attachments.json`);
          
          // Read existing mappings or create new with type definition
          let mappings: Record<string, any[]> = {};
          if (fs.existsSync(mappingsPath)) {
            try {
              mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8')) as Record<string, any[]>;
            } catch (e) {
              // If file exists but is corrupt, start fresh
              mappings = {};
            }
          }
          
          // Add this screenshot to the mappings
          if (!mappings[testUuid]) {
            mappings[testUuid] = [];
          }
          
          mappings[testUuid].push({
            name: name,
            filename: screenshotFileName,
            uuid: uuid,
            timestamp: timestamp
          });
          
          // Write updated mappings
          fs.writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2));
        } catch (mappingError) {
          this.logger.error('Failed to update test attachment mappings', mappingError);
        }
      }
      
      this.logger.info(`Screenshot saved for Allure with multiple methods: ${screenshotPath}`);
      
      return screenshotPath;
    } catch (error) {
      this.logger.error('Failed to take screenshot', error);
      return undefined;
    }
  }
  
  /**
   * Clean up resources after scenario
   */
  async cleanup(): Promise<void> {
    if (this.driver) {
      try {
        this.logger.info('Cleaning up driver');
        await this.driver.deleteSession();
      } catch (error) {
        this.logger.error('Error during cleanup', error);
      } finally {
        this.driver = undefined;
      }
    }
  }
}

// Register the custom world with Cucumber
setWorldConstructor(TestWorld);

// Register types for dependency injection
container.register('ConfigManager', { useClass: ConfigManager });
container.register('Logger', { useClass: Logger });
container.register('DriverFactory', { useClass: DriverFactory });
container.register('ApiClient', { useClass: ApiClient });
