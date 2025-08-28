# API Testing Examples

This directory contains example feature files organized by category for API testing using Cucumber.js.

## Directory Structure

- **basics/** - Basic API testing operations (CRUD)
- **rest/** - REST API testing patterns and data validation
- **advanced/** - Advanced API testing patterns and best practices
- **auth/** - Authentication methods for API testing
- **integration/** - Integration testing between multiple API endpoints

## Features by Category

### Basic API Operations
- Simple CRUD operations (Create, Read, Update, Delete)
- Basic response validation

### REST API Testing
- Common REST API patterns
- Query parameters
- Data validation techniques
- Schema validation

### Advanced Testing Patterns
- Best practices for organization
- Complex validations
- Data-driven testing

### Authentication Methods
- Basic auth
- API key
- Bearer token
- OAuth2
- JWT

### Integration Testing
- Chained requests
- Data dependencies between requests
- Multi-step API workflows

## Running Tests

To run all API tests:

```bash
npx cucumber-js --profile api
```

To run tests from a specific category:

```bash
# Run only basic tests
npx cucumber-js --profile api src/test/features/api/examples/basics/

# Run only REST API tests
npx cucumber-js --profile api src/test/features/api/examples/rest/

# Run only advanced pattern tests
npx cucumber-js --profile api src/test/features/api/examples/advanced/

# Run only authentication tests
npx cucumber-js --profile api src/test/features/api/examples/auth/

# Run only integration tests
npx cucumber-js --profile api src/test/features/api/examples/integration/
```
