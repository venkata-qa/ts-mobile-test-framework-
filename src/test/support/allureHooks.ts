import { After, AfterStep, Before, BeforeStep, setDefaultTimeout } from '@cucumber/cucumber';
import allureReporter from '@wdio/allure-reporter';
import { ScreenshotUtil } from '../../core/utils/screenshot-util';
// Import your custom World class
import { TestWorld } from './world';

// Set a larger default timeout to accommodate mobile operations
setDefaultTimeout(60 * 1000);

// Initialize Allure reporting for each scenario
Before(function(this: TestWorld, scenario) {
  // Add feature and scenario info to Allure report
  const featureName = scenario.gherkinDocument.feature?.name || 'Unknown Feature';
  const scenarioName = scenario.pickle.name;
  
  console.log(`Setting up Allure reporting for scenario: ${scenarioName}`);
  
  allureReporter.addFeature(featureName);
  allureReporter.addStory(scenarioName);
  
  // Add environment info
  const platform = process.env.PLATFORM || 'unknown';
  const env = process.env.TEST_ENV || 'unknown';
  
  allureReporter.addArgument('platform', platform);
  allureReporter.addArgument('environment', env);
  
  // Add tags as labels
  scenario.pickle.tags.forEach(tag => {
    allureReporter.addLabel('tag', tag.name.replace('@', ''));
  });
});

// Take screenshots after each step for Allure reporting
AfterStep(async function(this: TestWorld, { pickleStep, result }) {
  if (!this.driver) {
    console.log('AfterStep: No driver instance available, skipping screenshot');
    return; // Skip if driver is not initialized
  }

  try {
    // Get step name for screenshot
    const stepName = pickleStep.text;
    
    console.log(`Taking screenshot for step: ${stepName}`);
    
    // Take screenshot and attach to Allure report - pass the driver instance
    const screenshotPath = await ScreenshotUtil.takeAndAttachScreenshot(this.driver, stepName);
    
    if (screenshotPath) {
      console.log(`Screenshot saved to ${screenshotPath}`);
    } else {
      console.log('Failed to save screenshot');
    }
    
    // For failed steps, also add a labeled failure screenshot
    if (result.status === 'FAILED') {
      await ScreenshotUtil.takeAndAttachScreenshot(this.driver, `FAILED_${stepName}`, true);
      
      // Add step failure details to allure report
      allureReporter.addStep(`Step Failed: ${stepName}`);
      allureReporter.addDescription(`Error: ${result.message}`, 'text');
    }
  } catch (error) {
    console.error(`Error in AfterStep screenshot hook: ${error}`);
  }
});

// Take screenshots after test failure
After(async function(this: TestWorld, scenario) {
  if (!this.driver) {
    return; // Skip if driver is not initialized
  }

  if (scenario.result?.status === 'FAILED') {
    try {
      const scenarioName = scenario.pickle.name;
      await ScreenshotUtil.takeAndAttachScreenshot(this.driver, `SCENARIO_FAILED_${scenarioName}`, true);
      
      // Add test failure details to allure report
      allureReporter.addFeature(scenario.pickle.uri || 'Unknown Feature');
      allureReporter.addDescription(`Scenario "${scenarioName}" failed`, 'text');
    } catch (error) {
      console.error(`Error in After scenario screenshot hook: ${error}`);
    }
  }
});
