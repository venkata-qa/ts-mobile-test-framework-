import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { TestWorld } from './world';
import { Logger } from '../../core/utils/logger';
import { ConfigManager } from '../../core/utils/config-manager';

// Create logger and config for hooks
const logger = new Logger('Hooks');
const configManager = new ConfigManager();

// Set default timeout for all steps
const defaultTimeout = configManager.get<number>('stepTimeout', 60000);
setDefaultTimeout(defaultTimeout);

/**
 * Run once before any scenarios are executed
 */
BeforeAll(async function() {
  logger.info('Starting test execution');
  logger.info(`Running with environment: ${configManager.get<string>('environment', 'unknown')}`);
  logger.info(`Default step timeout: ${defaultTimeout}ms`);
});

/**
 * Run once after all scenarios are executed
 */
AfterAll(async function() {
  logger.info('Test execution completed');
});

/**
 * Run before each mobile scenario
 * Identifies mobile scenarios by the @android, @androiddemo, @ios, or @iosdemo tags
 */
Before({ tags: '@android or @androiddemo' }, async function(this: TestWorld) {
  logger.info('Starting mobile scenario on android platform');
  await this.initMobileDriver('android');
});

Before({ tags: '@ios or @iosdemo' }, async function(this: TestWorld) {
  // Skip iOS initialization if driver already exists (created by iosHooks.ts)
  if (this.driver) {
    logger.info('iOS driver already initialized by specialized hooks, skipping standard initialization');
    return;
  }
  logger.info('Starting mobile scenario on ios platform');
  await this.initMobileDriver('ios');
});

Before({ tags: '@mobile and not @android and not @androiddemo and not @ios and not @iosdemo' }, async function(this: TestWorld) {
  const platform = configManager.get<string>('platform', 'android') as 'android' | 'ios';
  logger.info(`Starting mobile scenario on ${platform} platform`);
  await this.initMobileDriver(platform);
});

/**
 * Run before each API scenario
 * Identifies API scenarios by the @api tag
 */
Before({ tags: '@api' }, async function(this: TestWorld) {
  logger.info('Starting API scenario');
  this.initApiClient();
});

/**
 * Run before each scenario to record the start time
 */
Before(async function(this: TestWorld) {
  // Store the start time to calculate duration later
  this.setTestData('testStartTime', Date.now());
  
  // Store a random ID for the test to correlate files
  this.setTestData('testUuid', `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
});

/**
 * Run after each scenario to capture screenshots, logs, and data for Allure reports
 */
After(async function(this: TestWorld, scenario) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Get test metadata
    const testStartTime = this.getTestData<number>('testStartTime') || Date.now();
    const testEndTime = Date.now();
    const testDuration = testEndTime - testStartTime;
    const testUuid = this.getTestData<string>('testUuid') || `test-${Date.now()}`;
    const isFailed = scenario.result?.status === 'FAILED';
    
    // Ensure allure-results directory exists
    const allureDir = path.resolve(process.cwd(), 'allure-results');
    if (!fs.existsSync(allureDir)) {
      fs.mkdirSync(allureDir, { recursive: true });
    }
    
    // Always take a screenshot for failed tests
    let screenshotPath: string | undefined;
    if (this.driver) {
      try {
        // Create meaningful name for the screenshot
        const screenshotPrefix = isFailed ? 'FAILED' : 'passed';
        const screenshotName = `${screenshotPrefix}-${scenario.pickle.name}`;
        
        // Take and save the screenshot using our enhanced method
        screenshotPath = await this.takeScreenshot(screenshotName);
        
        // Save extra test information for failures
        if (isFailed && scenario.result?.message) {
          // Save error message as a text file
          const errorFile = path.join(allureDir, `error-${testUuid}.txt`);
          fs.writeFileSync(errorFile, scenario.result.message);
          
          // Create properties for the error file
          fs.writeFileSync(`${errorFile}.properties`, [
            'name=Error Details',
            'type=text/plain',
            `uuid=${testUuid}-error`
          ].join('\n'));
          
          logger.info(`Error details saved: ${errorFile}`);
        }
      } catch (screenshotError) {
        logger.error('Failed to take or save screenshot', screenshotError);
      }
    }
    
    // Extract feature name from URI
    const featureName = scenario.pickle.uri?.split('/').pop()?.replace('.feature', '') || 'unknown';
    const featureFile = scenario.pickle.uri?.split('/').pop() || 'unknown.feature';
    
    // Generate a consistent historyId for test retries
    const historyId = `${featureFile}:${scenario.pickle.name.replace(/\s+/g, '_')}`;
    
    // Extract scenario tags
    const tags = scenario.pickle.tags?.map(tag => tag.name.replace('@', '')) || [];
    
    // Create detailed labels for better organization in Allure
    const labels = [
      { name: 'feature', value: featureName },
      { name: 'story', value: scenario.pickle.name },
      { name: 'suite', value: scenario.gherkinDocument?.feature?.name || featureName },
      { name: 'package', value: featureName },
      { name: 'testClass', value: scenario.gherkinDocument?.feature?.name || featureName },
      { name: 'framework', value: 'cucumber-js' },
      { name: 'language', value: 'javascript' },
      { name: 'host', value: require('os').hostname() },
      { name: 'thread', value: process.pid.toString() }
    ];
    
    // Add platform as a label
    if (this.driver) {
      try {
        // Access the capabilities property and extract platform safely with type assertion
        const capabilities = this.driver.capabilities as any;
        const platformName = capabilities?.platformName || 
                           capabilities?.['appium:platformName'] || 
                           'unknown';
        labels.push({ name: 'platform', value: platformName });
        labels.push({ name: 'epic', value: `Mobile Testing - ${platformName}` });
      } catch (error) {
        labels.push({ name: 'epic', value: 'Mobile Testing' });
      }
    } else {
      labels.push({ name: 'epic', value: 'Mobile Testing' });
    }
    
    // Add all tags as labels
    tags.forEach(tag => {
      labels.push({ name: 'tag', value: tag });
    });
    
    // Extract steps with enhanced details
    const steps = scenario.pickle.steps.map((step, index) => {
      // Create a more detailed step representation
      // PickleStep doesn't have keyword property in Cucumber v8+, use fixed "Step" instead
      const stepKeyword = 'Step';
      const stepText = step.text;
      
      // Determine step status (only last step fails if the scenario failed)
      const isLastStep = index === scenario.pickle.steps.length - 1;
      const stepFailed = isFailed && isLastStep;
      
      // Calculate approximate timing
      const stepDuration = testDuration / scenario.pickle.steps.length;
      const stepStart = testStartTime + (index * stepDuration);
      const stepEnd = stepStart + stepDuration;
      
      return {
        name: `${stepKeyword} ${stepText}`,
        status: stepFailed ? 'failed' : 'passed',
        statusDetails: stepFailed ? {
          message: scenario.result?.message || 'Step failed',
          trace: scenario.result?.message || 'No stack trace available'
        } : undefined,
        stage: 'finished',
        start: stepStart,
        stop: stepEnd,
        parameters: [] // Can be populated with data table values if available
      };
    });
    
    // Create a complete test result JSON for Allure with enhanced details
    const testResult = {
      uuid: testUuid,
      name: scenario.pickle.name,
      fullName: `${featureName}: ${scenario.pickle.name}`,
      historyId: historyId,
      status: isFailed ? 'failed' : 'passed',
      statusDetails: isFailed ? {
        message: scenario.result?.message || 'Test failed',
        trace: scenario.result?.message || 'No stack trace available'
      } : undefined,
      stage: 'finished',
      start: testStartTime,
      stop: testEndTime,
      labels: labels,
      links: [],
      steps: steps,
      attachments: [],
      parameters: [], // Can be populated with scenario outline values if available
      // Pickle doesn't have description property in this version, use a generated description
      descriptionHtml: `<p>Feature: ${featureName} - Scenario: ${scenario.pickle.name}</p>`
    };
    
    // Add screenshot attachment to the test result if we have one
    if (screenshotPath) {
      const screenshotName = path.basename(screenshotPath);
      
      // Add to test result attachments
      (testResult as any).attachments.push({
        name: isFailed ? 'Failure Screenshot' : 'Screenshot',
        source: screenshotName,
        type: 'image/png'
      });
    }
    
    // Save the test result JSON with proper formatting
    const testResultPath = path.join(allureDir, `${testUuid}-result.json`);
    fs.writeFileSync(testResultPath, JSON.stringify(testResult, null, 2));
    
    logger.info(`Enhanced test result saved for Allure: ${testResultPath}`);
  } catch (error) {
    logger.error('Error preparing Allure reporting data', error);
  }
});

/**
 * Run after each scenario to clean up resources
 */
After(async function(this: TestWorld) {
  logger.info('Cleaning up after scenario');
  await this.cleanup();
});
