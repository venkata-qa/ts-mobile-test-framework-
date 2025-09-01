Feature: SauceLabs Demo App Testing
  As a user
  I want to interact with the SauceLabs demo app
  So that I can explore its functionality

  @android @mobile
  Scenario: Login with valid credentials
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    And the "productsLabel" element in the "SauceProductsPage" page should contain text "PRODUCTS"

  @android @mobile
  Scenario: Login with invalid credentials
    When I type "invalid_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "invalid_password" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "errorMessage" element in the "SauceLoginPage" page should be visible
    And the "errorMessage" element in the "SauceLoginPage" page should contain text "Username and password do not match"

  @android @mobile
  Scenario: Browse and add product to cart
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    
    When I tap on the "firstProductTitle" element in the "SauceProductsPage" page
    Then the "productDetailTitle" element in the "SauceProductsPage" page should be visible
    
    When I tap on the "addToCartButton" element in the "SauceProductsPage" page
    And I tap on the "cartButton" element in the "SauceProductsPage" page
    Then the "cartItem" element in the "SauceProductsPage" page should be visible
    And the "cartItemCount" element in the "SauceProductsPage" page should contain text "1"

  @android @mobile
  Scenario: Swipe through products
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    
    When I swipe "up"
    And I swipe "up"
    Then I scroll to text "Sauce Labs Onesie"
    And I tap on the element with text "Sauce Labs Onesie"
    Then the "productDetailTitle" element in the "SauceProductsPage" page should be visible
