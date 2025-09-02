@api @questionnaire
Feature: Bupa Questionnaire API
  As an API user
  I want to retrieve questionnaires
  So that I can get questionnaire data for use in the application

  Background:
    Given I set API base URL to "https://questionnaire-dev.api.bupa.co.uk"
    And I set request header "Accept" to "application/json"
    And I set request header "X-bupagoldenid" to "44cc1892-9f6b-ef11-a670-6045bd9643ca"
    And I set request header "Authorization" to "Bearer 2j4SqD0PTFPkFY2XNkzRUAdKptxm*]"

  @smoke
  Scenario: Get all questionnaires with pagination
    Given I set query parameter "include" to "template,version"
    And I set query parameter "page" to "1"
    And I set query parameter "per-page" to "10"
    When I send a GET request to "/questionnaire/api/v1/questionnaires"
    Then the response status code should be 200
    And the response should be valid JSON
    And the response should be an array with at least 1 item(s)
    And the response should contain the field "data"
    
  @regression
  Scenario: Get questionnaires with validation of response structure
    Given I set query parameter "include" to "template,version"
    And I set query parameter "page" to "1"
    And I set query parameter "per-page" to "10"
    When I send a GET request to "/questionnaire/api/v1/questionnaires"
    Then the response status code should be 200
    And the response should be valid JSON
    And the response should contain the field "data"
    And the response should contain the field "meta"
    And the response should contain the field "meta.pagination"
    And the response should contain the field "meta.pagination.total"
    And the response should contain the field "meta.pagination.count"
    And the response should contain the field "meta.pagination.per_page"
    And the response should contain the field "meta.pagination.current_page"
    
  @regression
  Scenario: Verify questionnaire data structure
    Given I set query parameter "include" to "template,version"
    And I set query parameter "page" to "1"
    And I set query parameter "per-page" to "1"
    When I send a GET request to "/questionnaire/api/v1/questionnaires"
    Then the response status code should be 200
    And the response should match the following schema:
    """
    {
      "type": "object",
      "required": ["data", "meta"],
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "type", "attributes"],
            "properties": {
              "id": { "type": "string" },
              "type": { "type": "string" },
              "attributes": { "type": "object" }
            }
          }
        },
        "meta": {
          "type": "object",
          "required": ["pagination"],
          "properties": {
            "pagination": {
              "type": "object",
              "required": ["total", "count", "per_page", "current_page", "total_pages"],
              "properties": {
                "total": { "type": "integer" },
                "count": { "type": "integer" },
                "per_page": { "type": "integer" },
                "current_page": { "type": "integer" },
                "total_pages": { "type": "integer" }
              }
            }
          }
        }
      }
    }
    """

  @negative
  Scenario: Attempt to access questionnaires without authorization
    Given I set query parameter "include" to "template,version"
    And I set query parameter "page" to "1"
    And I set query parameter "per-page" to "10"
    # Remove the authorization header
    And I set request header "Authorization" to ""
    When I send a GET request to "/questionnaire/api/v1/questionnaires"
    Then the response status code should be 401
    
  @negative
  Scenario: Attempt to access questionnaires without X-bupagoldenid header
    Given I set query parameter "include" to "template,version"
    And I set query parameter "page" to "1"
    And I set query parameter "per-page" to "10"
    # Remove the X-bupagoldenid header
    And I set request header "X-bupagoldenid" to ""
    When I send a GET request to "/questionnaire/api/v1/questionnaires"
    Then the response status code should be 401
    
  @edge-case
  Scenario: Handle empty result set for a user with no questionnaires
    # Use a token for a user that has no questionnaires
    Given I set request header "Authorization" to "Bearer 2j4SqD0PTFPkFY2XNkzRUAdKptxm*]"
    And I set request header "X-bupagoldenid" to "44cc1892-9f6b-ef11-a670-6045bd9643ca"
    And I set query parameter "include" to "template,version"
    And I set query parameter "page" to "1"
    And I set query parameter "per-page" to "10"
    When I send a GET request to "/questionnaire/api/v1/questionnaires"
    Then the response status code should be 200
    And the response should be valid JSON
    And the response should contain the field "data" with value "[]"
    And the response should match the following schema:
    """
    {
      "type": "object",
      "required": ["data"],
      "properties": {
        "data": {
          "type": "array",
          "maxItems": 0
        },
        "meta": {
          "type": ["object", "null"]
        }
      }
    }
    """
    
  @token-specific
  Scenario Outline: Results vary based on user token
    # Test with different user tokens
    Given I set request header "Authorization" to "Bearer <token>"
    And I set request header "X-bupagoldenid" to "<golden_id>"
    And I set query parameter "include" to "template,version"
    And I set query parameter "page" to "1"
    And I set query parameter "per-page" to "10"
    When I send a GET request to "/questionnaire/api/v1/questionnaires"
    Then the response status code should be 200
    And the response should be valid JSON
    
    Examples:
      | token                       | golden_id                              | expected_result     |
      | 2j4SqD0PTFPkFY2XNkzRUAdKptxm*] | 44cc1892-9f6b-ef11-a670-6045bd9643ca | No questionnaires   |
      # Add more tokens/users as needed with different expected results
      # The framework will just validate the 200 status and valid JSON,
      # but you can manually verify the results for each user
