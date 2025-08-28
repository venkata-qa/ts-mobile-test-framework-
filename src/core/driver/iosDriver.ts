import { remote, RemoteOptions } from 'webdriverio';
import { injectable } from 'tsyringe';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../utils/config-manager';

/**
 * iOS driver capabilities interface
 */
export interface IOSCapabilities {
  platformName: string;
  'appium:deviceName': string;
  'appium:platformVersion': string;
  'appium:automationName': string;
  'appium:app'?: string;
  'appium:bundleId'?: string;
  'appium:udid'?: string;
  'appium:xcodeOrgId'?: string;
  'appium:xcodeSigningId'?: string;
  'appium:updatedWDABundleId'?: string;
  'appium:noReset'?: boolean;
  'appium:fullReset'?: boolean;
  'appium:newCommandTimeout'?: number;
  'appium:connectHardwareKeyboard'?: boolean;
  [key: string]: any;
}

/**
 * iOS Driver class for managing iOS device connections
 */
@injectable()
export class IOSDriver {
  private logger: Logger;
  private configManager: ConfigManager;
  
  constructor() {
    this.logger = new Logger('IOSDriver');
    this.configManager = new ConfigManager();
  }
  
  /**
   * Create a new iOS driver instance
   * @param capabilities Custom capabilities to merge with default ones
   * @returns WebdriverIO remote driver instance
   */
  async createDriver(customCapabilities: Partial<IOSCapabilities> = {}): Promise<WebdriverIO.Browser> {
    try {
      // Always override capabilities to use our iPhone 16 Plus simulator with SDK 18.6
      // Force using the exact simulator that is already booted
      const overrideCapabilities: Partial<IOSCapabilities> = {
        'appium:deviceName': 'iPhone 16 Plus',
        'appium:platformVersion': '18.6', // Use the available SDK version
        'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91', // Specific UDID of our existing simulator
        'appium:app': '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app',
        'appium:noNewCommandTimeout': true,
        'appium:showXcodeLog': true,
        'appium:usePrebuiltWDA': false,
        'appium:shouldUseSingletonTestManager': false,
        'appium:shouldTerminateApp': true,
        'appium:forceAppLaunch': true
      };
      
      const isCloud = this.configManager.get<boolean>('cloudEnabled', false);
      const capabilities = this.getCapabilities({...customCapabilities, ...overrideCapabilities}, isCloud);
      
      const options: RemoteOptions = {
        logLevel: 'info',
        capabilities
      };
      
      if (isCloud) {
        this.configureCloudOptions(options);
      } else {
        // Try environment variable first
        const envAppiumUrl = process.env.APPIUM_URL;
        // Then try config
        const configAppiumUrl = this.configManager.get<string>('appiumUrl');
        // Fall back to default URL
        const appiumUrl = envAppiumUrl || configAppiumUrl || 'http://localhost:4723';
        
        this.logger.info(`ENV APPIUM_URL: ${envAppiumUrl || 'not set'}`);
        this.logger.info(`CONFIG appiumUrl: ${configAppiumUrl || 'not set'}`);
        this.logger.info(`Using Appium URL: ${appiumUrl}`);
        
        const url = new URL(appiumUrl);
        options.hostname = url.hostname;
        options.port = parseInt(url.port, 10);
        options.path = '/'; // Changed from '/wd/hub' to '/' for Appium 3.x
      }
      
      this.logger.info('Initializing iOS driver with capabilities:', capabilities);
      const driver = await remote(options);
      
      // Set implicit wait timeout
      await driver.setTimeout({ 
        implicit: this.configManager.get<number>('implicitTimeout', 5000) 
      });
      
      this.logger.info('iOS driver created successfully');
      return driver;
    } catch (error) {
      this.logger.error('Failed to create iOS driver:', error);
      throw error;
    }
  }
  
  /**
   * Get merged capabilities for iOS
   * @param customCapabilities Custom capabilities to merge
   * @param isCloud Whether to include cloud-specific capabilities
   * @returns Complete iOS capabilities
   */
  private getCapabilities(
    customCapabilities: Partial<IOSCapabilities>, 
    isCloud: boolean
  ): IOSCapabilities {
    // Debug log the ios configuration
    this.logger.info('iOS configuration from ConfigManager:');
    this.logger.info(`Environment: ${process.env.TEST_ENV}`);
    this.logger.info(`Platform: ${process.env.PLATFORM}`);
    this.logger.info(`Appium URL: ${process.env.APPIUM_URL}`);
    this.logger.info(`ios.deviceName: ${this.configManager.get<string>('ios.deviceName')}`);
    this.logger.info(`ios.platformVersion: ${this.configManager.get<string>('ios.platformVersion')}`);
    this.logger.info(`ios.udid: ${this.configManager.get<string>('ios.udid')}`);
    this.logger.info(`ios.appPath: ${this.configManager.get<string>('ios.appPath')}`);
    
    // Debug print the entire config
    try {
      this.logger.info(`Full config: ${JSON.stringify(this.configManager.getConfig(), null, 2)}`);
    } catch (error) {
      this.logger.error(`Error printing config: ${error}`);
    }
    
    const baseCapabilities: IOSCapabilities = {
      platformName: 'iOS',
      'appium:deviceName': this.configManager.get<string>('ios.deviceName', 'iPhone 16 Plus'),
      'appium:platformVersion': this.configManager.get<string>('ios.platformVersion', '18.6'),
      'appium:automationName': 'XCUITest',
      'appium:noReset': this.configManager.get<boolean>('ios.noReset', false),
      'appium:newCommandTimeout': 180,
      'appium:connectHardwareKeyboard': true,
      'appium:wdaLocalPort': 8100,
      'appium:usePrebuiltWDA': false,
      'appium:useNewWDA': true
    };
    
    // Add app path if provided in config - use iOS specific path
    const appPath = this.configManager.get<string>('ios.appPath');
    if (appPath) {
      baseCapabilities['appium:app'] = appPath;
      this.logger.info(`Using iOS app at path: ${appPath}`);
    }
    
    // Add bundle ID if provided - use iOS specific bundleId
    const bundleId = this.configManager.get<string>('ios.bundleId');
    if (bundleId) {
      baseCapabilities['appium:bundleId'] = bundleId;
    }
    
    // Add device UDID if provided (for real devices)
    const udid = this.configManager.get<string>('ios.udid');
    if (udid) {
      baseCapabilities['appium:udid'] = udid;
    }
    
    // Add signing info if provided (for real devices)
    const xcodeOrgId = this.configManager.get<string>('ios.xcodeOrgId');
    const xcodeSigningId = this.configManager.get<string>('ios.xcodeSigningId');
    if (xcodeOrgId) baseCapabilities['appium:xcodeOrgId'] = xcodeOrgId;
    if (xcodeSigningId) baseCapabilities['appium:xcodeSigningId'] = xcodeSigningId;
    
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
        options.path = '/wd/hub'; // Keep as '/wd/hub' for BrowserStack
        options.user = cloudUser;
        options.key = cloudKey;
        break;
      case 'saucelabs':
        options.hostname = 'ondemand.saucelabs.com';
        options.path = '/wd/hub'; // Keep as '/wd/hub' for SauceLabs
        options.user = cloudUser;
        options.key = cloudKey;
        break;
      default:
        this.logger.warn(`Unknown cloud provider: ${cloudProvider}. Using default configuration.`);
        break;
    }
  }
  
  /**
   * Get cloud-specific capabilities based on the configured provider
   * @returns Cloud-specific capabilities
   */
  private getCloudCapabilities(): Record<string, any> {
    const cloudProvider = this.configManager.get<string>('cloudProvider', '').toLowerCase();
    const projectName = this.configManager.get<string>('projectName', 'Mobile Test Project');
    const buildName = this.configManager.get<string>('buildName', `Build ${new Date().toISOString()}`);
    
    switch (cloudProvider) {
      case 'browserstack':
        return {
          'bstack:options': {
            projectName,
            buildName,
            debug: true,
            networkLogs: true
          }
        };
      case 'saucelabs':
        return {
          'sauce:options': {
            build: buildName,
            name: projectName
          }
        };
      default:
        return {};
    }
  }
}
