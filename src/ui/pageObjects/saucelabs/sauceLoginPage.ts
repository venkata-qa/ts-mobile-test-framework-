import { BasePage } from '../basePage';
import { injectable } from 'tsyringe';

/**
 * Login page object for the SauceLabs demo app
 */
@injectable()
export class SauceLoginPage extends BasePage {
  // Selectors for elements on the login page
  private readonly usernameFieldSelector = '~test-Username';
  private readonly passwordFieldSelector = '~test-Password';
  private readonly loginButtonSelector = '~test-LOGIN';
  private readonly errorMessageSelector = '~test-Error message';

  /**
   * Get the page's identifier
   * For mobile apps, this can be a screen name or identifier
   */
  get pageIdentifier(): string {
    return 'SauceLabsLoginScreen';
  }
  
  // Standard username and password for the SauceLabs demo app
  readonly standardUsername = 'standard_user';
  readonly lockedOutUsername = 'locked_out_user';
  readonly problemUsername = 'problem_user';
  readonly performanceUsername = 'performance_glitch_user';
  readonly standardPassword = 'secret_sauce';

  /**
   * Get the username input field
   */
  get usernameField() {
    return this.findElement(this.usernameFieldSelector);
  }

  /**
   * Get the password input field
   */
  get passwordField() {
    return this.findElement(this.passwordFieldSelector);
  }

  /**
   * Get the login button
   */
  get loginButton() {
    return this.findElement(this.loginButtonSelector);
  }

  /**
   * Get the error message element
   */
  get errorMessage() {
    return this.findElement(this.errorMessageSelector);
  }

  /**
   * Login with the provided username and password
   * @param username The username
   * @param password The password
   */
  async login(username: string, password: string): Promise<void> {
    const usernameField = await this.usernameField;
    const passwordField = await this.passwordField;
    const loginButton = await this.loginButton;
    
    await usernameField.setValue(username);
    await passwordField.setValue(password);
    await loginButton.click();
  }
}
