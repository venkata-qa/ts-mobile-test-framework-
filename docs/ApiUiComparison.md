# API and UI Comparison Guide

This guide demonstrates how to use the API and UI comparison steps for testing that UI elements display the correct data from API responses.

## Overview

The API-UI comparison framework allows you to:

1. Make API requests and store responses
2. Compare UI element text with data from stored API responses
3. Compare UI element attributes with API response data
4. Customize comparison behavior with options like number tolerance, date formats, etc.

## Step Definitions

### Saving API Responses

```gherkin
Given I save the API response as "keyName"
```

Saves the entire API response from the most recent API call with a key for later reference.

```gherkin
Given I save the API response property "data.users[0].name" as "firstName"
```

Saves a specific property from the API response using JSONPath notation.

### Basic Comparison

```gherkin
Then I verify the UI element "profileName" matches the API response "userProfile.name"
```

Compares the text of a UI element with a value from a stored API response. The API response reference uses the format `keyName.propertyPath`.

### Attribute Comparison

```gherkin
Then I verify the UI element "profileImage" attribute "src" matches the API response "userProfile.avatar"
```

Compares an attribute of a UI element with a value from a stored API response.

### Advanced Comparison Options

```gherkin
Then I verify the UI element "totalPrice" matches the API response "orderDetails.price" with "tolerance" "0.01"
```

Compares with a specific tolerance for numerical values.

```gherkin
Then I verify the UI element "appointmentDate" matches the API response "booking.date" with "dateFormat" "DD/MM/YYYY"
```

Compares dates with a specific format.

```gherkin
Then I verify the UI element "description" matches the API response "product.summary" with "partialMatch" "true"
```

Checks if the UI element contains the API value (partial match).

## Example Scenario

Here's a complete example scenario:

```gherkin
Scenario: Verify user profile information
  # Make API request and store response
  Given I make a GET request to "/api/users/current"
  And I save the API response as "userProfile"
  
  # Navigate to the profile page in the UI
  When I navigate to the "Profile" page
  
  # Verify UI elements match API response data
  Then I verify the UI element "userName" matches the API response "userProfile.name"
  And I verify the UI element "userEmail" matches the API response "userProfile.email"
  And I verify the UI element "memberSince" matches the API response "userProfile.joinDate" with "dateFormat" "DD/MM/YYYY"
  And I verify the UI element "profilePicture" attribute "src" matches the API response "userProfile.avatarUrl"
```

## Tips for Using the Comparison Steps

1. **Use descriptive keys** when saving API responses to make your tests more readable.
2. **Structure your tests** with API calls first, followed by UI navigation, and then comparisons.
3. **Use appropriate comparison options** for different data types:
   - Use `tolerance` for currency or decimal values
   - Use `dateFormat` for formatted dates
   - Use `partialMatch` when the UI might show truncated or partial content
4. **Be specific with JSONPath** notation to access nested properties.

## Advanced Use Cases

### Comparing Arrays

When dealing with lists in the UI that come from API data:

```gherkin
Scenario: Verify order items
  Given I make a GET request to "/api/orders/12345"
  And I save the API response property "items[0].name" as "firstItemName"
  
  When I navigate to the "Order Details" page
  
  Then I verify the UI element "orderItems[0].name" matches the API response "firstItemName"
```

### Dynamic Selectors

You can combine with other steps to create dynamic selectors based on API data:

```gherkin
Scenario: Verify product search results
  Given I make a GET request to "/api/products?search=laptop"
  And I save the API response property "results[0].id" as "firstProductId"
  
  When I search for "laptop"
  
  Then I verify the UI element "[data-product-id='${firstProductId}'] .product-name" matches the API response "results[0].name"
```

This approach enables robust testing of the integration between your API and UI layers, ensuring that data is correctly displayed to users.
