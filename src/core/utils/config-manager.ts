import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { injectable } from 'tsyringe';
import { Logger } from '../utils/logger';

/**
 * Interface for environment configuration
 */
export interface EnvConfig {
  platform: string;
  environment: string;
  appiumUrl: string;
  baseApiUrl: string;
  cloudEnabled: boolean;
  cloudProvider: string;
  cloudUser?: string;
  cloudKey?: string;
  implicitTimeout: number;
  explicitTimeout: number;
  retryAttempts: number;
  [key: string]: any;
}

/**
 * Configuration manager class
 * Handles loading and accessing configuration from various sources (env vars, config files)
 */
@injectable()
export class ConfigManager {
  private config: EnvConfig = {} as EnvConfig;
  private logger: Logger;

  /**
   * Initialize the configuration manager
   */
  constructor() {
    this.logger = new Logger('ConfigManager');
    this.loadConfig();
  }

  /**
   * Load configuration from multiple sources with proper precedence
   * 1. Environment variables
   * 2. .env file
   * 3. JSON config files
   * 4. Default values
   */
  private loadConfig(): void {
    // Load .env file
    dotenv.config();
    
    // Set the environment
    const env = process.env.TEST_ENV || 'dev';
    
    // Load the base config
    const baseConfigPath = path.resolve(process.cwd(), 'config/default.json');
    let baseConfig = {};
    
    if (fs.existsSync(baseConfigPath)) {
      try {
        baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf8'));
      } catch (error) {
        this.logger.error(`Failed to parse base config file: ${error}`);
      }
    }
    
    // Load the environment-specific config
    const envConfigPath = path.resolve(process.cwd(), `config/${env}.json`);
    let envConfig = {};
    
    if (fs.existsSync(envConfigPath)) {
      try {
        envConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf8'));
      } catch (error) {
        this.logger.error(`Failed to parse env config file: ${error}`);
      }
    }
    
    // Merge configurations with proper precedence
    this.config = {
      // Default values
      platform: 'android',
      environment: env,
      appiumUrl: 'http://localhost:4723',
      baseApiUrl: 'https://api.example.com',
      cloudEnabled: false,
      cloudProvider: 'browserstack',
      implicitTimeout: 5000,
      explicitTimeout: 15000,
      retryAttempts: 3,
      
      // Merge with base config
      ...baseConfig,
      
      // Merge with environment specific config
      ...envConfig,
      
      // Environment variables take highest precedence
      ...this.getEnvVarConfig()
    };
    
    this.logger.info(`Configuration loaded for environment: ${env}`);
    this.logger.debug('Configuration:', this.config);
  }

  /**
   * Get configuration values from environment variables
   */
  private getEnvVarConfig(): Partial<EnvConfig> {
    return {
      platform: process.env.PLATFORM,
      appiumUrl: process.env.APPIUM_URL,
      baseApiUrl: process.env.BASE_API_URL,
      cloudEnabled: process.env.CLOUD_ENABLED === 'true',
      cloudProvider: process.env.CLOUD_PROVIDER,
      cloudUser: process.env.CLOUD_USER,
      cloudKey: process.env.CLOUD_KEY,
      implicitTimeout: process.env.IMPLICIT_TIMEOUT ? parseInt(process.env.IMPLICIT_TIMEOUT, 10) : undefined,
      explicitTimeout: process.env.EXPLICIT_TIMEOUT ? parseInt(process.env.EXPLICIT_TIMEOUT, 10) : undefined,
      retryAttempts: process.env.RETRY_ATTEMPTS ? parseInt(process.env.RETRY_ATTEMPTS, 10) : undefined
    };
  }

  /**
   * Get the full config object
   */
  getConfig(): EnvConfig {
    return { ...this.config };
  }

  /**
   * Get a specific config value, supports nested paths with dot notation
   * @param key The configuration key (can include dots for nested properties)
   * @param defaultValue Default value if the key is not found
   */
  get<T>(key: string, defaultValue?: T): T {
    // Handle nested paths with dot notation
    if (key.includes('.')) {
      const parts = key.split('.');
      let value: any = this.config;
      
      for (const part of parts) {
        if (value === undefined || value === null) {
          return defaultValue as T;
        }
        value = value[part];
      }
      
      return (value !== undefined) ? value : defaultValue as T;
    }
    
    // Handle simple keys
    return (this.config[key] !== undefined) ? this.config[key] : defaultValue as T;
  }
}
