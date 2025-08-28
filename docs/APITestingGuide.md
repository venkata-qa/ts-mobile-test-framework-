# API Testing Framework Documentation

## Overview

This document outlines the organization of the API testing framework step definitions and explains how to use them effectively.

## Step Definition Files

The API testing framework uses the following step definition files:

1. **apiCommonSteps.ts**: Contains the core API steps for making requests, setting headers, validating responses, etc.
2. **apiAdvancedSteps.ts**: Contains advanced steps for complex validations, data storage, schema validation, etc.

## Common API Steps

Basic steps available for API testing:

- `I set API base URL to "{url}"`
- `I set request header: {header}={value}`
- `I set request body`
- `I send a {method} request to "{endpoint}"`
- `the response status code should be {code}`
- `the response should be valid JSON`
- `the response should be an array`
- `the response should be an array with at least {count} items`
- `the response should contain the field "{field}" with value "{value}"`
- `the response body should match schema "{schemaName}"`

## Advanced API Steps

Advanced API testing capabilities:

- `I store the response field "{field}" as "{variableName}"`: Extracts a value from the response and stores it for later use. Supports dot notation for nested properties (e.g., "0.id", "user.address.city").
- `the response should match JSON schema`: Validates the response against a JSON schema.
- `the response field "{field}" should be of type {type}`: Validates the type of a specific field in the response.
- `I save response body for debugging`: Saves the response body to a file for debugging.

## Best Practices

1. **Use Standard Steps**: Prefer using the standard steps from apiCommonSteps.ts for common operations.
2. **Keep Features Readable**: Write features in a business-readable format, using the provided step definitions.
3. **Avoid Duplication**: Don't create new step definitions for functionality that already exists.
4. **Use Data Storage**: For scenarios that require data from previous steps, use the "store response field" step.

## Example Scenarios

### Basic API Test

```gherkin
Scenario: Get todos and verify response
  Given I set API base URL to "https://jsonplaceholder.typicode.com"
  When I send a GET request to "/todos"
  Then the response status code should be 200
  And the response should be an array with at least 100 items
```

### Advanced API Test

```gherkin
Scenario: Perform conditional validations on response
  Given I set API base URL to "https://jsonplaceholder.typicode.com"
  When I send a GET request to "/users"
  Then the response status code should be 200
  And the response should be an array with at least 5 items
  # Store the first user ID
  And I store the response field "0.id" as "userId"
  When I send a GET request to "/posts"
  Then the response status code should be 200
  And the response should be an array with at least 10 items
```

## Troubleshooting

If you encounter issues with API tests, check the following:

1. Ensure the API base URL is correctly set
2. Verify that request headers are properly configured
3. Check that response validation steps are correct and match the actual response
4. For field-specific validations, confirm the field path is correct (e.g., "user.address.city")
