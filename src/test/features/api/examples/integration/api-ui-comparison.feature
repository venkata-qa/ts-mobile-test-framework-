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
    And I verify the UI element "productImage" attribute "src" matches the API response "data.imageUrl"
