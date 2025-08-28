@api
Feature: Example API Testing Best Practices
  This feature demonstrates the recommended approach to API testing

  Background:
    Given I set API base URL to "https://jsonplaceholder.typicode.com"

  @basic
  Scenario: Retrieve user details and validate response structure
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should be valid JSON
    And the response should contain the field "id" with value "1"
    And the response should contain the field "name" with value "Leanne Graham"
    And the response should contain the field "email" with value "Sincere@april.biz"
    And the response should contain the field "address.city" with value "Gwenborough"
    And the response should contain the field "company.name" with value "Romaguera-Crona"

  @advanced
  Scenario: Create, update and delete a resource
    # Create a new post
    Given I set request header: Content-Type=application/json
    And I set request body
      """
      {
        "title": "Test Post",
        "body": "This is a test post",
        "userId": 1
      }
      """
    When I send a POST request to "/posts"
    Then the response status code should be 201
    And the response should be valid JSON
    And the response should contain the field "id"
    And I store the response field "id" as "postId"
    
    # Update the created post
    Given I set request body
      """
      {
        "title": "Updated Test Post",
        "body": "This post has been updated"
      }
      """
    When I send a PUT request to "/posts/1"
    Then the response status code should be 200
    And the response should contain the field "title" with value "Updated Test Post"
    
    # Delete the post
    When I send a DELETE request to "/posts/1"
    Then the response status code should be 200

  @data-driven
  Scenario Outline: Validate different users' data
    When I send a GET request to "/users/<userId>"
    Then the response status code should be 200
    And the response should contain the field "name" with value "<name>"
    And the response should contain the field "email" with value "<email>"
    
    Examples:
      | userId | name                  | email                     |
      | 1      | Leanne Graham         | Sincere@april.biz         |
      | 2      | Ervin Howell          | Shanna@melissa.tv         |
      | 3      | Clementine Bauch      | Nathan@yesenia.net        |
