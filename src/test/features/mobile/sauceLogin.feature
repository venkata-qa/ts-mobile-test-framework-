@mobile
Feature: SauceLabs Demo App Authentication
  As a mobile user
  I want to be able to log in to the app
  So that I can access my account and use the application

  Background:
    Given I am on the SauceLabs demo app

  @android
  Scenario: Successful login with valid credentials on Android
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    And the "productsLabel" element in the "SauceProductsPage" page should contain text "PRODUCTS"

  @ios
  Scenario: Successful login with valid credentials on iOS
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    And the "productsLabel" element in the "SauceProductsPage" page should contain text "PRODUCTS"

  @android
  Scenario: Failed login with invalid credentials on Android
    When I type "invalid_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "wrong_password" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "errorMessage" element in the "SauceLoginPage" page should be visible
    And the "errorMessage" element in the "SauceLoginPage" page should contain text "Username and password do not match"

  @android
  Scenario: Browse products after login on Android
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    When I swipe "up"
    And I swipe "down"
    Then the "productItems" elements in the "SauceProductsPage" page should have count 6
