import allureReporter from '@wdio/allure-reporter';
import fs from 'fs';
import path from 'path';

/**
 * Utility class for handling screenshots and attaching them to Allure reports
 */
export class ScreenshotUtil {
  /**
   * Takes a screenshot and attaches it to the Allure report
   * @param driver WebdriverIO browser/driver instance
   * @param name Name of the screenshot
   * @param failureImage Whether this is a failure image
   * @returns Path to the saved screenshot
   */
  static async takeAndAttachScreenshot(
    driver: WebdriverIO.Browser | undefined,
    name: string, 
    failureImage: boolean = false
  ): Promise<string | undefined> {
    if (!driver) {
      console.error('Cannot take screenshot: No driver instance provided');
      return undefined;
    }

    try {
      // Create screenshots directory if it doesn't exist
      const screenshotDir = path.resolve(process.cwd(), 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      // Take screenshot
      const timestamp = new Date().getTime();
      const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const screenshotPath = path.join(screenshotDir, `${sanitizedName}_${timestamp}.png`);
      
      // Take screenshot using the provided driver instance
      await driver.saveScreenshot(screenshotPath);

      // Attach to Allure report
      if (fs.existsSync(screenshotPath)) {
        const content = fs.readFileSync(screenshotPath);
        allureReporter.addAttachment(
          failureImage ? `Failure Screenshot: ${name}` : `Step Screenshot: ${name}`,
          content,
          'image/png'
        );
        return screenshotPath;
      }
    } catch (error) {
      console.error(`Failed to take or attach screenshot: ${error}`);
    }
    return undefined;
  }
}
