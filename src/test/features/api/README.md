# API Testing Framework

This directory contains the API testing framework for the project.

## Directory Structure

- **examples/** - Well-organized example feature files categorized by testing type:
  - **basics/** - Basic CRUD operations
  - **rest/** - REST API testing patterns and data validation
  - **advanced/** - Advanced API testing patterns and best practices
  - **auth/** - Authentication methods for API testing
  - **integration/** - Integration testing between multiple API endpoints
- **backup/** - Backup of old feature files (for reference only)
- **../../steps/api/** - Contains the step definitions for API testing

## How to Write New API Tests

To create new API tests:

1. Look at the examples in the `examples` directory to understand how to structure your tests
2. Choose the appropriate category pattern for your test (basic, REST, advanced, auth, integration)
3. Follow the naming convention: `[category]/[number]-[descriptive-name].feature`
4. Place your new feature files in this directory (or create a subdirectory for your feature area)
5. Run your tests using: `npx cucumber-js --profile api`

## Available Step Definitions

The API testing framework provides step definitions for:

- Setting up API requests (base URL, headers, query parameters, etc.)
- Making HTTP requests (GET, POST, PUT, DELETE, etc.)
- Validating response status codes and response times
- Validating response bodies (JSON structure, field values, etc.)
- Storing and reusing response values between steps

For a complete list of available step definitions, refer to the files in `../../steps/api/` directory.

## Running Tests

```bash
# Run all API tests
npx cucumber-js --profile api

# Run tests from a specific category
npx cucumber-js --profile api src/test/features/api/examples/basics/

# Run a specific test
npx cucumber-js --profile api src/test/features/api/examples/basics/01-basic-crud-operations.feature
```
