@api
Feature: REST API Test Examples
  This feature contains examples of common REST API testing patterns

  Background:
    Given I set API base URL to "https://jsonplaceholder.typicode.com"

  @get
  Scenario: Verify GET API with query parameters
    Given I set query parameter "userId" to "1"
    And I set query parameter "completed" to "false"
    When I send a GET request to "/todos"
    Then the response status code should be 200
    And the response should be an array
    And the response should be an array with at least 5 items
    
  @post
  Scenario: Create a new resource with POST
    Given I set request header: Content-Type=application/json
    And I set request body
      """
      {
        "title": "New Task",
        "body": "Complete the API testing framework",
        "userId": 1
      }
      """
    When I send a POST request to "/posts"
    Then the response status code should be 201
    And the response should be valid JSON
    And the response should contain the field "id"
    And the response should contain the field "title" with value "New Task"

  @put
  Scenario: Update a resource with PUT
    Given I set request header: Content-Type=application/json
    And I set request body
      """
      {
        "id": 1,
        "title": "Updated Task",
        "body": "This task has been updated",
        "userId": 1,
        "completed": true
      }
      """
    When I send a PUT request to "/todos/1"
    Then the response status code should be 200
    And the response should contain the field "title" with value "Updated Task"
    And the response should contain the field "completed" with value "true"

  @delete
  Scenario: Delete a resource
    When I send a DELETE request to "/posts/1"
    Then the response status code should be 200

  @data-driven
  Scenario Outline: Test multiple endpoints
    When I send a GET request to "/<resource>/<id>"
    Then the response status code should be 200
    And the response should contain the field "id" with value "<id>"

    Examples:
      | resource | id |
      | posts    | 1  |
      | users    | 2  |
      | todos    | 3  |
      | albums   | 4  |
