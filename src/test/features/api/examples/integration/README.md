# API Testing Examples - Integration Testing

This directory contains feature files demonstrating API integration testing patterns.

## Files

1. **01-api-integrations.feature**
   - Shows how to test integrations between multiple API endpoints
   - Includes chained requests with data dependencies
   - Demonstrates multi-step API workflows
   - Shows how to store and reuse data between requests

## Running Tests

To run these API integration tests:

```bash
npx cucumber-js --profile api src/test/features/api/examples/integration/
```
