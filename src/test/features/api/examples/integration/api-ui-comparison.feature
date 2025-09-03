Feature: API and UI Data Comparison

  This feature demonstrates how to compare API data with UI elements
  
  @api @ui @comparison
  Scenario: Verify user profile information matches API data
    # Make API request and save response
    Given I make a GET request to "/api/users/current"
    And I save the API response as "userProfile"
    
    # Navigate to profile page in the app
    When I open the "Profile" screen
    
    # Compare UI elements with API data
    Then I verify the UI element "profileName" matches the API response "userProfile.name"
    And I verify the UI element "profileEmail" matches the API response "userProfile.email"
    And I verify the UI element "memberSince" matches the API response "userProfile.joinDate" with "dateFormat" "DD/MM/YYYY"
    
  @api @ui @comparison
  Scenario: Verify product details match API data
    # Make API request and save specific properties
    Given I make a GET request to "/api/products/123"
    And I save the API response property "data.price" as "productPrice"
    And I save the API response property "data.description" as "productDescription"
    
    # Navigate to product details in the app
    When I open the "ProductDetails" screen with id "123"
    
    # Compare UI elements with API data using different comparison options
    Then I verify the UI element "productPrice" matches the API response "productPrice" with "tolerance" "0.01"
    And I verify the UI element "productDesc" matches the API response "productDescription" with "partialMatch" "true"
    And I verify the UI element "productImage" attribute "src" matches the API response "data.imageUrl" on the "ProductDetailsPage" page
    
  @api @ui @comparison
  Scenario Outline: Verify health checks data matches API
    # Set up the API request
    Given I set API base URL to "https://api.example.com"
    And I set request header "Ocp-Apim-Subscription-Key" to "c11da06f584449ae9e648610649e175a"
    And I set query parameter "PatientId" to "645360c8-5f88-4452-adf2-f527988e71f1"
    
    # Execute the API call
    When I send a GET request to "/v1/health-checks"
    Then the response status code should be 200
    
    # Save the API response for later comparison
    Then I save the initial response for "<API>"
    
    # Verify UI elements are visible
    Then I verify that the following fields should be visible on the "AddHealthChecksPage"
      | addHealthCheckDoneButton  |
      | addHealthCheckInputSearch |
    
    # Compare multiple UI elements with API data using a data table
    Then I verify the data of below elements to actual "<API>" data on the "AddHealthChecksPage" page
      | apiPath                               | uiElement                     |
      | $.healthCheckList[*].healthCheckTitle | addHealthCheckTitle           |
      | $.healthCheckList[*].healthCheckTitle | addHealthCheckTextDescription |
    
    Examples:
      | API                  |
      | HealthChecksList     |
