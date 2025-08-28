# API Testing Examples - REST API Testing

This directory contains feature files demonstrating various REST API testing techniques.

## Files

1. **01-rest-operations.feature**
   - Shows common REST API testing patterns
   - Includes query parameters, data-driven testing with examples
   - Demonstrates different HTTP methods

2. **02-data-validation.feature**
   - Demonstrates various data validation techniques
   - Shows schema validation, array validation, field validation
   - Includes error response testing

## Running Tests

To run these REST API tests:

```bash
npx cucumber-js --profile api src/test/features/api/examples/rest/
```
