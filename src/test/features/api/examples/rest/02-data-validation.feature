@api @rest @validation
Feature: REST API Data Validation
  This feature demonstrates various data validation techniques for REST APIs

  Background:
    Given I set API base URL to "https://jsonplaceholder.typicode.com"

  @schema-validation
  Scenario: Validate API response against schema
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should match the following schema:
    """
    {
      "type": "object",
      "required": ["id", "name", "username", "email", "address", "phone", "website", "company"],
      "properties": {
        "id": { "type": "number" },
        "name": { "type": "string" },
        "username": { "type": "string" },
        "email": { "type": "string" },
        "address": {
          "type": "object",
          "required": ["street", "suite", "city", "zipcode", "geo"],
          "properties": {
            "street": { "type": "string" },
            "suite": { "type": "string" },
            "city": { "type": "string" },
            "zipcode": { "type": "string" },
            "geo": {
              "type": "object",
              "required": ["lat", "lng"],
              "properties": {
                "lat": { "type": "string" },
                "lng": { "type": "string" }
              }
            }
          }
        }
      }
    }
    """

  @array-validation
  Scenario: Validate array responses with complex conditions
    When I send a GET request to "/users/1/posts"
    Then the response status code should be 200
    And the response should be an array with at least 5 items
    And each array item should contain the fields "id, title, body, userId"
    And each array item should have the field "userId" with value "1"
    
  @field-validation
  Scenario: Validate specific fields with different formats
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should contain the field "email" matching regex "^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$"
    And the response should contain the field "phone" matching regex "^[0-9\\-().x\\s]+$"
    And the response should contain the field "website" matching regex "^(http://www\\.|https://www\\.|http://|https://)?[a-zA-Z0-9]+([\\-\\.]{1}[a-zA-Z0-9]+)*\\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(/.*)?$"
    
  @error-validation
  Scenario: Validate error responses
    When I send a GET request to "/users/999"
    Then the response status code should be 404
    And the response should be an empty object
