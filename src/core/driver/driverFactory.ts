import { injectable } from 'tsyringe';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../utils/config-manager';
import { AndroidDriver, AndroidCapabilities } from './androidDriver';
import { IOSDriver, IOSCapabilities } from './iosDriver';

/**
 * Type for mobile platform selection
 */
export type MobilePlatform = 'android' | 'ios';

/**
 * Driver factory for creating appropriate driver instances
 * Abstracts platform-specific details and provides a unified interface
 */
@injectable()
export class DriverFactory {
  private logger: Logger;
  private configManager: ConfigManager;
  private androidDriver: AndroidDriver;
  private iosDriver: IOSDriver;
  
  constructor() {
    this.logger = new Logger('DriverFactory');
    this.configManager = new ConfigManager();
    this.androidDriver = new AndroidDriver();
    this.iosDriver = new IOSDriver();
  }
  
  /**
   * Create a new driver instance based on the specified platform
   * @param platform The mobile platform to create a driver for (android or ios)
   * @param capabilities Custom capabilities to pass to the driver
   * @returns WebdriverIO browser instance
   */
  async createDriver(
    platform?: MobilePlatform, 
    capabilities: Record<string, any> = {}
  ): Promise<WebdriverIO.Browser> {
    // If platform is not specified, use the one from config
    const targetPlatform = platform || this.configManager.get<string>('platform', 'android') as MobilePlatform;
    
    this.logger.info(`Creating driver for platform: ${targetPlatform}`);
    
    // Check if we're running on BrowserStack
    const isBrowserStack = process.env.ENV === 'browserstack';
    
    // Only apply local device overrides if not running on BrowserStack
    if (!isBrowserStack) {
      // For iOS, always force the platformVersion to 18.6 to match available SDK
      if (targetPlatform.toLowerCase() === 'ios') {
        capabilities['appium:platformVersion'] = '18.6';
        capabilities['appium:deviceName'] = 'iPhone 16 Plus';
        capabilities['appium:udid'] = 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91';
        capabilities['appium:app'] = '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app';
        this.logger.info('Overriding iOS capabilities to use SDK 18.6');
      }
    } else {
      this.logger.info('Running on BrowserStack - using provided capabilities');
    }
    
    switch (targetPlatform.toLowerCase()) {
      case 'android':
        return this.androidDriver.createDriver(capabilities as Partial<AndroidCapabilities>);
      case 'ios':
        return this.iosDriver.createDriver(capabilities as Partial<IOSCapabilities>);
      default:
        throw new Error(`Unsupported platform: ${targetPlatform}`);
    }
  }
}
