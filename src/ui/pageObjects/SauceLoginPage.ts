import { BasePage } from './basePage';

/**
 * Page object for the SauceLabs Demo App Login Page
 */
export class SauceLoginPage extends BasePage {
  /**
   * Get the page identifier for logging and debugging
   */
  get pageIdentifier(): string {
    return 'SauceLogin';
  }

  /**
   * Element selectors for the login page
   */
  get elements(): Record<string, string> {
    return {
      // Using accessibility IDs (prefixed with ~) which are more reliable than XPath
      // These selectors work for both Android and iOS
      usernameField: '~test-Username',
      passwordField: '~test-Password',
      loginButton: '~test-LOGIN',
      errorMessage: '~test-Error message'
    };
  }
}

export default SauceLoginPage;
