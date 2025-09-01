import { remote, RemoteOptions } from 'webdriverio';
import { injectable } from 'tsyringe';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../utils/config-manager';

/**
 * Android driver capabilities interface
 */
export interface AndroidCapabilities {
  platformName: string;
  'appium:deviceName': string;
  'appium:platformVersion': string;
  'appium:automationName': string;
  'appium:app'?: string;
  'appium:appPackage'?: string;
  'appium:appActivity'?: string;
  'appium:noReset'?: boolean;
  'appium:fullReset'?: boolean;
  'appium:newCommandTimeout'?: number;
  [key: string]: any;
}

/**
 * Android Driver class for managing Android device connections
 */
@injectable()
export class AndroidDriver {
  private logger: Logger;
  private configManager: ConfigManager;
  
  constructor() {
    this.logger = new Logger('AndroidDriver');
    this.configManager = new ConfigManager();
    
    // Log the entire configuration to debug
    const config = this.configManager.getConfig();
    this.logger.info('Full config:', JSON.stringify(config, null, 2));
  }
  
  /**
   * Create a new Android driver instance
   * @param capabilities Custom capabilities to merge with default ones
   * @returns WebdriverIO remote driver instance
   */
  async createDriver(customCapabilities: Partial<AndroidCapabilities> = {}): Promise<WebdriverIO.Browser> {
    try {
      const isCloud = this.configManager.get<boolean>('cloudEnabled', false);
      const capabilities = this.getCapabilities(customCapabilities, isCloud);
      
      const options: RemoteOptions = {
        logLevel: 'info',
        capabilities
      };
      
      // Try environment variable first
      const envAppiumUrl = process.env.APPIUM_URL;
      // Then try config
      const configAppiumUrl = this.configManager.get<string>('appiumUrl');
      // Fall back to default URL
      const appiumUrl = envAppiumUrl || configAppiumUrl || 'http://localhost:4723';
      
      this.logger.info(`ENV APPIUM_URL: ${envAppiumUrl || 'not set'}`);
      this.logger.info(`CONFIG appiumUrl: ${configAppiumUrl || 'not set'}`);
      this.logger.info(`Using Appium URL: ${appiumUrl}`);
      
      // Check if we're using BrowserStack
      const isBrowserStack = appiumUrl.includes('browserstack');
      
      if (isBrowserStack) {
        // For BrowserStack, we need to parse the URL differently
        const bsUrl = new URL(appiumUrl);
        
        // Set BrowserStack specific options
        options.hostname = bsUrl.hostname;
        options.port = 443;
        options.path = '/wd/hub';
        
        // Extract username and key from URL if they exist
        if (bsUrl.username && bsUrl.password) {
          options.user = bsUrl.username;
          options.key = bsUrl.password;
        }
        
        this.logger.info('Using BrowserStack configuration');
      } else {
        // Local Appium server
        try {
          const url = new URL(appiumUrl);
          options.hostname = url.hostname;
          options.port = parseInt(url.port, 10) || 4723;
          options.path = '/wd/hub';
        } catch (error) {
          this.logger.error(`Invalid Appium URL: ${appiumUrl}. Using default.`);
          options.hostname = 'localhost';
          options.port = 4723;
          options.path = '/wd/hub';
        }
      }
      
      this.logger.info('Initializing Android driver with capabilities:', capabilities);
      const driver = await remote(options);
      
      // Set implicit wait timeout
      await driver.setTimeout({ 
        implicit: this.configManager.get<number>('implicitTimeout', 5000) 
      });
      
      this.logger.info('Android driver created successfully');
      return driver;
    } catch (error) {
      this.logger.error('Failed to create Android driver:', error);
      throw error;
    }
  }
  
  /**
   * Get merged capabilities for Android
   * @param customCapabilities Custom capabilities to merge
   * @param isCloud Whether to include cloud-specific capabilities
   * @returns Complete Android capabilities
   */
  private getCapabilities(
    customCapabilities: Partial<AndroidCapabilities>, 
    isCloud: boolean
  ): AndroidCapabilities {
    const baseCapabilities: AndroidCapabilities = {
      platformName: 'Android',
      'appium:deviceName': this.configManager.get<string>('deviceName', 'Pixel 3'),
      'appium:platformVersion': this.configManager.get<string>('platformVersion', '16'), // Updated to match available emulator version
      'appium:automationName': 'UiAutomator2',
      'appium:noReset': this.configManager.get<boolean>('noReset', false),
      'appium:newCommandTimeout': 180
    };
    
    // Add app path if provided in config
    const appPath = this.configManager.get<string>('appPath');
    if (appPath) {
      baseCapabilities['appium:app'] = appPath;
    }
    
    // Add app package and activity if provided
    const appPackage = this.configManager.get<string>('appPackage');
    const appActivity = this.configManager.get<string>('appActivity');
    if (appPackage) baseCapabilities['appium:appPackage'] = appPackage;
    if (appActivity) baseCapabilities['appium:appActivity'] = appActivity;
    
    // Add cloud-specific capabilities
    if (isCloud) {
      return {
        ...baseCapabilities,
        ...this.getCloudCapabilities(),
        ...customCapabilities
      };
    }
    
    return {
      ...baseCapabilities,
      ...customCapabilities
    };
  }
  
  /**
   * Configure WebdriverIO options for cloud providers
   * @param options RemoteOptions to be configured
   */
  private configureCloudOptions(options: RemoteOptions): void {
    const cloudProvider = this.configManager.get<string>('cloudProvider', '');
    const cloudUser = this.configManager.get<string>('cloudUser', '');
    const cloudKey = this.configManager.get<string>('cloudKey', '');
    
    switch (cloudProvider.toLowerCase()) {
      case 'browserstack':
        options.hostname = 'hub-cloud.browserstack.com';
        options.path = '/wd/hub'; // Keep /wd/hub for BrowserStack
        options.user = cloudUser;
        options.key = cloudKey;
        break;
      case 'saucelabs':
        options.hostname = 'ondemand.saucelabs.com';
        options.path = '/wd/hub'; // Keep /wd/hub for SauceLabs
        options.user = cloudUser;
        options.key = cloudKey;
        break;
      default:
        this.logger.warn(`Unknown cloud provider: ${cloudProvider}`);
    }
  }
  
  /**
   * Get cloud-specific capabilities
   * @returns Cloud capabilities
   */
  private getCloudCapabilities(): Record<string, any> {
    const cloudProvider = this.configManager.get<string>('cloudProvider', '');
    
    switch (cloudProvider.toLowerCase()) {
      case 'browserstack':
        return {
          'bstack:options': {
            projectName: this.configManager.get<string>('projectName', 'Mobile Test Project'),
            buildName: this.configManager.get<string>('buildName', `Build ${new Date().toISOString()}`),
            debug: this.configManager.get<boolean>('debug', false),
            networkLogs: this.configManager.get<boolean>('networkLogs', false)
          }
        };
      case 'saucelabs':
        return {
          'sauce:options': {
            build: this.configManager.get<string>('buildName', `Build ${new Date().toISOString()}`),
            name: this.configManager.get<string>('testName', 'Mobile Test')
          }
        };
      default:
        return {};
    }
  }
}
