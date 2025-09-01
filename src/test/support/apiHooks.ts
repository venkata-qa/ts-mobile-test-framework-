import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { TestWorld } from './world';
import { Logger } from '../../core/utils/logger';
import { ConfigManager } from '../../core/utils/config-manager';
import * as fs from 'fs';
import * as path from 'path';

// Create logger and config for API hooks
const logger = new Logger('ApiHooks');
const configManager = new ConfigManager();

// Set default timeout for all steps (duplicated from hooks.ts to ensure it runs even if hooks.ts is not loaded)
const defaultTimeout = configManager.get<number>('stepTimeout', 60000);
setDefaultTimeout(defaultTimeout);

/**
 * Run once before any API scenarios are executed
 */
BeforeAll(async function() {
  logger.info('Starting API test execution');
  logger.info(`Running with environment: ${configManager.get<string>('environment', 'unknown')}`);
  logger.info(`Default step timeout: ${defaultTimeout}ms`);
});

/**
 * Run once after all API scenarios are executed
 */
AfterAll(async function() {
  logger.info('API test execution completed');
});

// API hooks logger and config manager already defined above

/**
 * Run before each API scenario
 * Identifies API scenarios by the @api tag
 * Overrides the general hook in hooks.ts
 */
Before({ tags: '@api' }, async function(this: TestWorld) {
  logger.info('Starting API scenario');
  this.initApiClient();
});

/**
 * Run after each API scenario
 * Handles specific API test reporting needs
 */
After({ tags: '@api' }, async function(this: TestWorld, scenario) {
  try {
    // Get test metadata
    const testStartTime = this.getTestData<number>('testStartTime') || Date.now();
    const testEndTime = Date.now();
    const testDuration = testEndTime - testStartTime;
    const testUuid = this.getTestData<string>('testUuid') || `test-${Date.now()}`;
    const isFailed = scenario.result?.status === 'FAILED';
    
    // Log API test results
    logger.info(`API Test completed: ${scenario.pickle.name}`);
    logger.info(`Status: ${scenario.result?.status}`);
    logger.info(`Duration: ${testDuration}ms`);
    
    // Ensure allure-results directory exists for reporting
    const allureDir = path.resolve(process.cwd(), 'allure-results');
    if (!fs.existsSync(allureDir)) {
      fs.mkdirSync(allureDir, { recursive: true });
    }
    
    // Store API request and response data if available
    const apiRequestData = this.getTestData<string>('lastApiRequest');
    const apiResponseData = this.getTestData<string>('lastApiResponse');
    
    if (apiRequestData) {
      const requestFilePath = path.resolve(allureDir, `${testUuid}-request.json`);
      fs.writeFileSync(requestFilePath, apiRequestData);
      this.attach(apiRequestData, 'application/json');
    }
    
    if (apiResponseData) {
      const responseFilePath = path.resolve(allureDir, `${testUuid}-response.json`);
      fs.writeFileSync(responseFilePath, apiResponseData);
      this.attach(apiResponseData, 'application/json');
    }
    
  } catch (error) {
    logger.error('Error in API after hook', error);
  }
});
