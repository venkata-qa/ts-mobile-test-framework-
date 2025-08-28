@mobile @android
Feature: SauceLabs Demo App - Mobile Testing Demo

  # This consolidated feature file demonstrates the key mobile testing capabilities
  # using the SauceLabs sample app with a single scenario

  Background: 
    # This will run before each scenario
    Given I am on the SauceLabs demo app

  @demo
  Scenario: Complete mobile demo flow
    # Step 1: Login with valid credentials
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    And the "productsLabel" element in the "SauceProductsPage" page should contain text "PRODUCTS"
    
    # Step 2: Navigate through products
    When I swipe "up"
    And I swipe "down"
    
    # Step 3: Add product to cart
    When I tap on the "addToCartButton" element in the "SauceProductsPage" page
    Then the "cartBadge" element in the "SauceProductsPage" page should contain text "1"
    
    # Step 4: Check cart
    When I tap on the "cartButton" element in the "SauceProductsPage" page
    Then the "cartTitle" element in the "SauceCartPage" page should be visible
    And the "cartItemName" element in the "SauceCartPage" page should be visible
    
    # Step 5: Checkout process
    When I tap on the "checkoutButton" element in the "SauceCartPage" page
    Then the "checkoutTitle" element in the "SauceCheckoutPage" page should be visible
    
    # Step 6: Fill customer information
    When I type "Test" into the "firstNameField" field in the "SauceCheckoutPage" page
    And I type "User" into the "lastNameField" field in the "SauceCheckoutPage" page
    And I type "12345" into the "postalCodeField" field in the "SauceCheckoutPage" page
    And I tap on the "continueButton" element in the "SauceCheckoutPage" page
    
    # Step 7: Complete checkout
    Then the "summaryTitle" element in the "SauceCheckoutSummaryPage" page should be visible
    When I tap on the "finishButton" element in the "SauceCheckoutSummaryPage" page
    Then the "completeTitle" element in the "SauceCheckoutCompletePage" page should be visible
    And the "completeTitle" element in the "SauceCheckoutCompletePage" page should contain text "THANK YOU"
