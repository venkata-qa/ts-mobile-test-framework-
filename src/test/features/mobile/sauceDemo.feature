@mobile @android
Feature: SauceLabs Demo App Test

  # This feature file tests the SauceLabs Demo App using our common mobile steps
  # No need to create new step definitions as we're using the ones we've already built

  @login
  Scenario: Login with valid credentials
    # First, we wait for the login screen to load
    When I wait for the "usernameField" element in the "SauceLoginPage" page to be visible
    # Enter the credentials
    And I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    # Tap the login button
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    # Verify we're on the products page
    Then the "productHeader" element in the "SauceProductsPage" page should be visible
    And the "productHeader" element in the "SauceProductsPage" page should contain text "PRODUCTS"

  @navigation
  Scenario: Navigate through the product list
    # Login first
    When I wait for the "usernameField" element in the "SauceLoginPage" page to be visible
    And I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    # Verify we're on the products page
    Then the "productHeader" element in the "SauceProductsPage" page should be visible
    # Scroll down to see more products
    When I swipe "up"
    # Scroll back up
    And I swipe "down"
    # Tap on a product
    And I tap on the "firstProductTitle" element in the "SauceProductsPage" page
    # Verify product details
    Then the "productDetailsTitle" element in the "SauceProductsPage" page should be visible

  @cart
  Scenario: Add product to cart
    # Login first
    When I wait for the "usernameField" element in the "SauceLoginPage" page to be visible
    And I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    # Add item to cart
    And I tap on the "addToCartButton" element in the "SauceProductsPage" page
    # Verify cart badge shows 1 item
    Then the "cartBadge" element in the "SauceProductsPage" page should be visible
    And the "cartBadge" element in the "SauceProductsPage" page should contain text "1"
