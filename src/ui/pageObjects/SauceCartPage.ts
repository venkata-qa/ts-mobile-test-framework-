import { BasePage } from './basePage';

/**
 * Page object for the SauceLabs Demo App Cart Page
 */
class SauceCartPage extends BasePage {
  /**
   * Get the page identifier for logging and debugging
   */
  get pageIdentifier(): string {
    return 'SauceCart';
  }

  /**
   * Element selectors for the cart page
   */
  get elements(): Record<string, string> {
    return {
      cartTitle: '~test-YOUR CART',
      cartItemName: '~test-Item title',
      cartItemPrice: '~test-Price',
      cartItemDesc: '~test-Description',
      checkoutButton: '~test-CHECKOUT',
      continueShoppingButton: '~test-CONTINUE SHOPPING',
      removeButton: '~test-REMOVE'
    };
  }
}

export default SauceCartPage;
