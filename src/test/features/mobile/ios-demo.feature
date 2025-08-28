@iosdemo
Feature: SauceLabs Demo App Login on iOS
  As a mobile user
  I want to be able to log in to the app on iOS
  So that I can access the products

  Background:
    Given I am on the SauceLabs demo app

  Scenario: Successful login with valid credentials on iOS
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    # Verify that either the products label or the first product title is visible
    Then the "firstProductTitle" element in the "SauceProductsPage" page should be visible
