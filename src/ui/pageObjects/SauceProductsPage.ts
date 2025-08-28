import { BasePage } from './basePage';

/**
 * Page object for the SauceLabs Demo App Products Page
 */
export class SauceProductsPage extends BasePage {
  /**
   * Get the page identifier for logging and debugging
   */
  get pageIdentifier(): string {
    return 'SauceProducts';
  }

  /**
   * Element selectors for the products page
   */
  get elements(): Record<string, string> {
    return {
      // Using accessibility IDs that work for both Android and iOS where possible
      productsLabel: '~test-PRODUCTS',
      productsTitle: '~test-PRODUCTS',
      cartButton: '~test-Cart',
      addToCartButton: '~test-ADD TO CART',
      // First product title is a reliable indicator that we're on the products page
      firstProductTitle: '~test-Item title',
      cartBadge: '~test-Cart badge',
      menuButton: '~test-Menu',
      productDetailsTitle: '~test-PRODUCT DETAILS'
    };
  }
}

export default SauceProductsPage;
