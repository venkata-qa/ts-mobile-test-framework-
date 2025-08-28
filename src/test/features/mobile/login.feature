@mobile
Feature: User Authentication
  As a user of the app
  I want to be able to authenticate
  So that I can access my account

  Background:
    Given the app is launched

  @androi
  Scenario: Valid login on Android
    When I enter username "standard_user" in the login form
    And I enter password "secret_sauce" in the login form
    And I tap the login button
    Then I should see the products page

  @ios
  Scenario: Valid login on iOS
    When I enter username "standard_user" in the login form
    And I enter password "secret_sauce" in the login form
    And I tap the login button
    Then I should see the products page

  # @android
  # Scenario: Invalid login on Android
  #   When I enter username "invalid_user" in the login form
  #   And I enter password "wrong_password" in the login form
  #   And I tap the login button
  #   Then I should see an error message
  #   And the error message should contain "Username and password do not match"

  # @android @datadriven
  # Scenario Outline: Multiple login attempts on Android
  #   When I enter username "<username>" in the login form
  #   And I enter password "<password>" in the login form
  #   And I tap the login button
  #   Then the login should be "<result>"

  #   Examples:
  #     | username      | password        | result  |
  #     | standard_user | secret_sauce    | success |
  #     | locked_out    | secret_sauce    | failure |
  #     | problem_user  | wrong_password  | failure |
  #     | standard_user | wrong_password  | failure |
