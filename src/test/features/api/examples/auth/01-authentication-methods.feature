@api
Feature: API Authentication Examples
  This feature demonstrates different authentication methods for API testing

  @basic-auth
  Scenario: Test API with Basic Authentication
    Given I set API base URL to "https://httpbin.org"
    And I set basic authentication with username "user" and password "password"
    When I send a GET request to "/basic-auth/user/password"
    Then the response status code should be 200
    And the response should contain the field "authenticated" with value "true"
    And the response should contain the field "user" with value "user"

  @api-key
  Scenario: Test API with API Key Authentication
    Given I set API base URL to "https://httpbin.org"
    And I set query parameter "api_key" to "abc123456789"
    When I send a GET request to "/get"
    Then the response status code should be 200
    And the response should contain the field "args.api_key" with value "abc123456789"

  @bearer-token
  Scenario: Test API with Bearer Token Authentication
    Given I set API base URL to "https://httpbin.org"
    And I set request header "Authorization" to "Bearer jwt.token.here"
    When I send a GET request to "/headers"
    Then the response status code should be 200
    And the response should contain the field "headers.Authorization" with value "Bearer jwt.token.here"

  @oauth2
  Scenario: Test API with OAuth2 Flow
    Given I set API base URL to "https://httpbin.org"
    # In a real scenario, you would first:
    # 1. Get an auth token from an OAuth2 endpoint
    # 2. Store the token
    # 3. Use the token in subsequent requests
    And I set request header "Authorization" to "Bearer oauth2.access.token"
    When I send a GET request to "/anything"
    Then the response status code should be 200
    And the response should contain the field "headers.Authorization"
    
  @jwt
  Scenario: Test API with JWT token validation
    Given I set API base URL to "https://httpbin.org"
    And I set request header "Authorization" to "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    When I send a GET request to "/headers"
    Then the response status code should be 200
    And the response should contain the field "headers.Authorization"
