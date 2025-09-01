# API Testing Framework Optimizations

This document describes the optimizations made to the API testing framework to improve separation of concerns and test efficiency.

## Key Improvements

1. **Dedicated API Hooks**: Created `apiHooks.ts` to separate API testing concerns from mobile testing hooks
   - Specifically tailored Before/After hooks for API tests
   - Improved reporting for API test results
   - Reduced dependency on generic hooks

2. **Optimized Test Runner**: Enhanced `run-api-tests.sh` script
   - More specific file loading to avoid unnecessary mobile dependencies
   - Added environment detection and reporting
   - Improved output formatting with optional color support
   - Added automatic Allure report generation

3. **Common Utilities**: Created `common.sh` to share utility functions across test scripts
   - Colored logging functions
   - Environment variable management
   - Build verification and management
   - Platform-specific requirement checks

## Usage

To run API tests with the optimized setup:

```bash
npm run test:api
```

This will:
1. Load only the necessary files for API testing
2. Exclude mobile-specific dependencies
3. Generate both Cucumber JSON and Allure reports

## Customization

You can customize the test run with tags:

```bash
npm run test:api -- "@api and @smoke"
```

Or specify environment:

```bash
TEST_ENV=staging npm run test:api
```

## Benefits

- **Faster Test Execution**: By loading only the necessary files
- **Cleaner Separation of Concerns**: API hooks are now isolated from mobile hooks
- **Improved Maintainability**: Each test type has its dedicated hooks
- **Enhanced Reporting**: Better integration with Allure for API test results

## Future Improvements

1. Consider further splitting feature files into API-specific and mobile-specific directories
2. Add API performance metrics collection 
3. Add schema validation capabilities for all API responses
4. Implement API mocking for offline testing
