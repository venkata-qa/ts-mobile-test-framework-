import { injectable } from 'tsyringe';
import { BasePage } from './basePage';

/**
 * Products page object model
 * Contains all elements and methods related to the products screen
 */
@injectable()
export class ProductsPage extends BasePage {
  // Page identifier
  get pageIdentifier(): string {
    return 'Products Screen';
  }
  
  // Element selectors
  private selectors = {
    // Common selectors for both platforms
    productsTitle: '~products-title',
    productItems: '~product-item',
    productName: '~product-name',
    productPrice: '~product-price',
    productImage: '~product-image',
    addToCartButton: '~add-to-cart-button',
    sortButton: '~sort-button',
    filterButton: '~filter-button',
    cartButton: '~cart-button',
    menuButton: '~menu-button',
    
    // Platform-specific selectors
    android: {
      title: '//android.widget.TextView[@text="Products"]',
      productList: 'android=new UiSelector().resourceId("product_list")',
      productItem: 'android=new UiSelector().className("android.widget.FrameLayout").resourceIdMatches(".*product_item.*")',
      sortButton: 'android=new UiSelector().resourceId("sort_button")',
      filterButton: 'android=new UiSelector().resourceId("filter_button")',
    },
    ios: {
      title: '//XCUIElementTypeStaticText[@name="Products"]',
      productList: '~product_list',
      productItem: '~product_item',
      sortButton: '~sort_button',
      filterButton: '~filter_button',
    }
  };
  
  /**
   * Check if products page is loaded
   * @returns True if products page is loaded
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      // Use a helper method to safely get the platform
      const platform = await this.getPlatform();
      const titleSelector = platform === 'ios' ? this.selectors.ios.title : this.selectors.android.title;
      
      const titleElement = await this.findElement(titleSelector);
      return await titleElement.isDisplayed();
    } catch (error) {
      this.logger.error('Failed to verify products page', error);
      return false;
    }
  }
  
  /**
   * Get the number of products displayed on the page
   * @returns Count of product items
   */
  async getProductCount(): Promise<number> {
    const productElements = await this.findElements(this.selectors.productItems);
    return productElements.length;
  }
  
  /**
   * Tap on a product by its index (0-based)
   * @param index Product index to tap
   */
  async tapProduct(index: number): Promise<void> {
    const productElements = await this.findElements(this.selectors.productItems);
    
    if (index >= 0 && index < productElements.length) {
      await productElements[index].click();
    } else {
      throw new Error(`Product index ${index} is out of range. Total products: ${productElements.length}`);
    }
  }
  
  /**
   * Tap the sort button
   */
  async tapSortButton(): Promise<void> {
    await this.click(this.selectors.sortButton);
  }
  
  /**
   * Tap the cart button
   */
  async tapCartButton(): Promise<void> {
    await this.click(this.selectors.cartButton);
  }
  
  /**
   * Tap the menu button
   */
  async tapMenuButton(): Promise<void> {
    await this.click(this.selectors.menuButton);
  }
  
  /**
   * Scroll down the products list
   */
  async scrollDownProductsList(): Promise<void> {
    await this.swipe('up', 0.7);
  }
}
