@mobile
Feature: SauceLabs Demo App Authentication
  As a mobile user
  I want to be able to log in to the app
  So that I can access my account and use the application

  Background:
    Given the app is launched

  @android @smoke
  Scenario: Successful login with valid credentials on Android
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "productsLabel" element in the "SauceProductsPage" page should be visible
    And the "productsLabel" element in the "SauceProductsPage" page should contain text "PRODUCTS"

  @ios @smoke
  Scenario: Successful login with valid credentials on iOS
    When I type "standard_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "secret_sauce" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "firstProductTitle" element in the "SauceProductsPage" page should be visible

  @android @regression
  Scenario: Failed login with invalid credentials on Android
    When I type "invalid_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "wrong_password" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "errorMessage" element in the "SauceLoginPage" page should be visible
    And the "errorMessage" element in the "SauceLoginPage" page should contain text "Username and password do not match"

  @ios @regression
  Scenario: Failed login with invalid credentials on iOS
    When I type "invalid_user" into the "usernameField" field in the "SauceLoginPage" page
    And I type "wrong_password" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then the "errorMessage" element in the "SauceLoginPage" page should be visible
    And the "errorMessage" element in the "SauceLoginPage" page should contain text "Username and password do not match"

  @android @datadriven @regression
  Scenario Outline: Multiple login attempts on Android
    When I type "<username>" into the "usernameField" field in the "SauceLoginPage" page
    And I type "<password>" into the "passwordField" field in the "SauceLoginPage" page
    And I tap on the "loginButton" element in the "SauceLoginPage" page
    Then I should see the "<result>" status

    Examples:
      | username      | password       | result  |
      | standard_user | secret_sauce   | success |
      | locked_out    | secret_sauce   | failure |
      | problem_user  | wrong_password | failure |
      | standard_user | wrong_password | failure |
