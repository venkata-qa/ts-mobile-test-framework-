@api @integration
Feature: API Integration Examples
  This feature demonstrates how to test integrations between multiple API endpoints

  Background:
    Given I set API base URL to "https://jsonplaceholder.typicode.com"

  @chained-requests
  Scenario: Chained API requests with data dependency
    # Get a user first
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should contain the field "id" with value "1"
    And I store the response field "id" as "userId"
    
    # Then get posts for this user
    When I send a GET request to "/users/1/posts"
    Then the response status code should be 200
    And the response should be an array
    And I store the response field "[0].id" as "postId"
    
    # Then get comments for the first post
    When I send a GET request to "/posts/1/comments"
    Then the response status code should be 200
    And the response should be an array with at least 1 item
    
  @multi-step
  Scenario: Complete API flow with multiple operations
    # Create a post
    Given I set request header "Content-Type" to "application/json"
    And I set request body to:
    """
    {
      "title": "Integration Test Post",
      "body": "Testing integration between endpoints",
      "userId": 1
    }
    """
    When I send a POST request to "/posts"
    Then the response status code should be 201
    And I store the response field "id" as "createdPostId"
    
    # Add a comment to the post
    Given I set request body to:
    """
    {
      "postId": 1,
      "name": "Test Comment",
      "email": "test@example.com",
      "body": "This is a test comment on an integration test"
    }
    """
    When I send a POST request to "/comments"
    Then the response status code should be 201
    And I store the response field "id" as "commentId"
    
    # Get the post with comments
    When I send a GET request to "/posts/1/comments"
    Then the response status code should be 200
    And the response should be an array
    
    # Update the post
    Given I set request body to:
    """
    {
      "title": "Updated Integration Test Post",
      "body": "Updated content for integration test"
    }
    """
    When I send a PUT request to "/posts/1"
    Then the response status code should be 200
    And the response should contain the field "title" with value "Updated Integration Test Post"
    
    # Finally delete the post
    When I send a DELETE request to "/posts/1"
    Then the response status code should be 200
