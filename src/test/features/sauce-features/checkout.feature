@mobile
Feature: SauceLabs Demo App Checkout
  As a customer with items in my cart
  I want to complete the checkout process
  So that I can purchase my selected items

  Background:
    Given the app is launched
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    When I tap on the "addToCartButton" element in the "SauceProductsPage" page
    And I tap on the "cartButton" element in the "SauceProductsPage" page
    Then the "cartTitle" element in the "SauceCartPage" page should be visible

  @android @regression
  Scenario: Complete checkout process on Android
    When I tap on the "checkoutButton" element in the "SauceCartPage" page
    Then the "checkoutTitle" element in the "SauceCheckoutPage" page should be visible
    
    # Fill customer information
    When I type "Test" into the "firstNameField" field in the "SauceCheckoutPage" page
    And I type "User" into the "lastNameField" field in the "SauceCheckoutPage" page
    And I type "12345" into the "postalCodeField" field in the "SauceCheckoutPage" page
    And I tap on the "continueButton" element in the "SauceCheckoutPage" page
    
    # Verify checkout summary
    Then the "summaryTitle" element in the "SauceCheckoutSummaryPage" page should be visible
    When I tap on the "finishButton" element in the "SauceCheckoutSummaryPage" page
    Then the "completeTitle" element in the "SauceCheckoutCompletePage" page should be visible
    And the "completeTitle" element in the "SauceCheckoutCompletePage" page should contain text "THANK YOU"

  @ios @regression
  Scenario: Complete checkout process on iOS
    When I tap on the "checkoutButton" element in the "SauceCartPage" page
    Then the "checkoutTitle" element in the "SauceCheckoutPage" page should be visible
    
    # Fill customer information
    When I type "Test" into the "firstNameField" field in the "SauceCheckoutPage" page
    And I type "User" into the "lastNameField" field in the "SauceCheckoutPage" page
    And I type "12345" into the "postalCodeField" field in the "SauceCheckoutPage" page
    And I tap on the "continueButton" element in the "SauceCheckoutPage" page
    
    # Verify checkout summary
    Then the "summaryTitle" element in the "SauceCheckoutSummaryPage" page should be visible
    When I tap on the "finishButton" element in the "SauceCheckoutSummaryPage" page
    Then the "completeTitle" element in the "SauceCheckoutCompletePage" page should be visible
    And the "completeTitle" element in the "SauceCheckoutCompletePage" page should contain text "THANK YOU"

  @android @regression
  Scenario: Invalid checkout information on Android
    When I tap on the "checkoutButton" element in the "SauceCartPage" page
    Then the "checkoutTitle" element in the "SauceCheckoutPage" page should be visible
    
    # Submit without filling information
    When I tap on the "continueButton" element in the "SauceCheckoutPage" page
    Then the "errorMessage" element in the "SauceCheckoutPage" page should be visible
    And the "errorMessage" element in the "SauceCheckoutPage" page should contain text "Error: First Name is required"
