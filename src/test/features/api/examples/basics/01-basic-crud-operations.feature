Feature: Simple API Testing
  As an API tester
  I want to test APIs using simple, common steps
  So that anyone can easily understand and maintain the tests

  @api
  Scenario: Get a list of todos
    Given I set API base URL to "https://jsonplaceholder.typicode.com"
    When I send a GET request to "/todos"
    Then the response status code should be 200
    And the response should be an array with at least 10 items

  @api
  Scenario: Get a specific todo
    Given I set API base URL to "https://jsonplaceholder.typicode.com"
    When I send a GET request to "/todos/1"
    Then the response status code should be 200
    And the response should contain the field "id" with value "1"
    And the response should contain the field "title"
    And the response should contain the field "completed" with value "false"

  @api
  Scenario: Create a new todo
    Given I set API base URL to "https://jsonplaceholder.typicode.com"
    And I set request header "Content-Type" to "application/json"
    And I set request body to:
    """
    {
      "title": "Learn API Testing",
      "completed": false,
      "userId": 1
    }
    """
    When I send a POST request to "/todos"
    Then the response status code should be 201
    And the response should contain the field "title" with value "Learn API Testing"
    And the response should contain the field "id"

  @api
  Scenario: Update a todo
    Given I set API base URL to "https://jsonplaceholder.typicode.com"
    And I set request header "Content-Type" to "application/json"
    And I set request body to:
    """
    {
      "title": "Updated Todo",
      "completed": true
    }
    """
    When I send a PUT request to "/todos/1"
    Then the response status code should be 200
    And the response should contain the field "title" with value "Updated Todo"
    And the response should contain the field "completed" with value "true"
    
  @api
  Scenario: Delete a todo
    Given I set API base URL to "https://jsonplaceholder.typicode.com"
    When I send a DELETE request to "/todos/1"
    Then the response status code should be 200
    
  @api
  Scenario: Filter todos with query parameters
    Given I set API base URL to "https://jsonplaceholder.typicode.com"
    And I set query parameter "userId" to "1"
    And I set query parameter "completed" to "false"
    When I send a GET request to "/todos"
    Then the response status code should be 200
    And the response should be an array with at least 5 items
    And the response time should be less than 1000 ms
