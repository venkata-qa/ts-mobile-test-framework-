@mobile @api @integration
Feature: End-to-End Testing with Common Steps
  As a user of the app
  I want to test API and mobile integration
  So that I can ensure the system works end-to-end

  @android
  Scenario: User login with API verification
    # API steps from common/apiSteps.ts
    Given I set base URL to "https://api.example.com"
    And I set request header "Content-Type" to "application/json"
    When I set request body to:
      """
      {
        "username": "standard_user",
        "password": "secret_sauce"
      }
      """
    And I send "POST" request to "/api/auth/login"
    Then the response status code should be 200
    And the response body path "token" should be "valid_token"

    # Mobile steps from common/mobileSteps.ts and custom steps
    Given the app is launched
    When I enter username "standard_user" in the login form
    And I enter password "secret_sauce" in the login form
    And I tap the login button
    
    # UI common steps from common/uiSteps.ts
    Then element "~products-title" should be displayed
    And element "~products-title" should contain text "Products"
    
    # Common steps from common/commonSteps.ts
    When I take a screenshot named "successful_login"
    
  @android @db
  Scenario: User data verification with database
    # DB steps from common/dbSteps.ts
    Given I connect to "user_database" database
    When I execute SQL query:
      """
      SELECT * FROM users WHERE username = 'standard_user'
      """
    Then the query should return 1 rows
    And the query result should contain a row with values:
      | username | standard_user |
      | status   | active        |
    
    # Mobile steps
    Given the app is launched
    When I enter username "standard_user" in the login form
    And I enter password "secret_sauce" in the login form
    And I tap the login button
    
    # UI validation
    Then I should see the products page
    
    # Generic swipe using common mobile steps
    When I swipe "up"
    And I wait for 1000 milliseconds
