# API Testing with TypeScript Mobile Framework

This guide explains our approach to API testing using TypeScript, Cucumber, and Axios.

## API Testing Overview

Our framework provides a simple, maintainable approach to API testing with:

- Clear, readable Gherkin syntax
- Reusable step definitions
- Strong typing with TypeScript
- Request/response validation
- JSON Schema validation
- XML and HTML response validation
- Sequential API requests
- Performance testing
- Detailed logging and reporting

## Getting Started

### Running API Tests

Run all API tests:

```bash
npm run test:api
```

Run with pretty formatting:

```bash
npm run test:api:pretty
```

### Writing API Tests

1. Create a new feature file in `src/test/features/api/`
2. Use the `@api` tag to identify API tests
3. Follow the patterns in our example features

Example:

```gherkin
@api
Scenario: Get a list of users
  Given I set API base URL to "https://jsonplaceholder.typicode.com"
  When I send a GET request to "/users"
  Then the response status code should be 200
  And the response should be an array with at least 5 items
```

## Available Step Definitions

We provide step definitions for:

### Basic API Testing

- Setting up API requests (base URL, headers, query parameters)
- Making API requests (GET, POST, PUT, PATCH, DELETE)
- Validating responses (status code, JSON fields, array properties)
- Performance assertions (response time)

### Advanced API Testing

- JSON Schema validation
- XML response validation
- HTML response validation
- Storing and reusing response values
- Content type validation

## Documentation

For more detailed information about our API testing approach, see:

- [API Testing Guide](../docs/APITestingGuide.md) - Basic API testing documentation
- [Advanced API Testing Guide](../docs/AdvancedApiTesting.md) - Advanced features and patterns
- [API Steps Organization](../docs/APIStepsOrganization.md) - How step definitions are organized
- Example feature files in `src/test/features/api/examples/`

## Best Practices

1. Keep test scenarios focused and single-purpose
2. Use descriptive scenario titles
3. Validate only what matters for each test
4. Organize feature files by API resource or endpoint
5. Use scenario outlines for parameterized tests
