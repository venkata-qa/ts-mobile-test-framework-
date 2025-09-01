@mobile
Feature: SauceLabs Demo App Products
  As a logged-in user
  I want to browse and purchase products
  So that I can complete my shopping

  Background:
    Given the app is launched
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible

  @android @smoke
  Scenario: Browse products on Android
    When I swipe "up"
    And I swipe "down"
    Then the "productItems" elements in the "SauceProductsPage" page should have count 6

  @ios @smoke
  Scenario: Browse products on iOS
    When I swipe "up"
    And I swipe "down"
    Then the "productItems" elements in the "SauceProductsPage" page should have count 6

  @android @regression
  Scenario: Add product to cart on Android
    When I tap on the "addToCartButton" element in the "SauceProductsPage" page
    Then the "cartBadge" element in the "SauceProductsPage" page should contain text "1"
    When I tap on the "cartButton" element in the "SauceProductsPage" page
    Then the "cartTitle" element in the "SauceCartPage" page should be visible
    And the "cartItemName" element in the "SauceCartPage" page should be visible

  @ios @regression
  Scenario: Add specific product to cart on iOS
    When I scroll "down" to text "Test.allTheThings() T-Shirt"
    And I tap on the element with text "ADD TO CART"
    And I tap on the "cartButton" element in the "SauceProductsPage" page
    Then the element with text "YOUR CART" should be visible
    And the element with text "Test.allTheThings() T-Shirt" should be visible

  @android @regression
  Scenario: Menu navigation on Android
    When I tap on the "menuButton" element in the "SauceProductsPage" page
    And I tap on the element with text "ABOUT"
    Then the element with text "BACK TO PRODUCTS" should be visible
    When I tap on the element with text "BACK TO PRODUCTS"
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
