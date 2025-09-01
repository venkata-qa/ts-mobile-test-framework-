# Running Tests with Enhanced Allure Reporting

This guide focuses specifically on the Allure reporting capabilities that have been integrated into the testing framework.

## Enhanced Allure Features

The framework now includes advanced Allure reporting with:

- **Automatic Screenshot Capture**: Screenshots are automatically taken on test failures
- **Step-by-Step Visualization**: Each test step is properly displayed with status
- **Categorized Failures**: Test failures are categorized for easier troubleshooting
- **Environment Information**: Comprehensive environment details included in the report
- **Custom Categories**: Tests are categorized by failure types for better analysis

## Setup for Allure Reporting

1. **Install Allure Command-line Tools**:

   **macOS**:
   ```bash
   brew install allure
   ```

   **Windows**:
   ```bash
   scoop install allure
   # OR
   choco install allure-commandline
   ```

   **Linux**:
   ```bash
   sudo apt-add-repository ppa:qameta/allure
   sudo apt-get update
   sudo apt-get install allure
   ```

2. **Install Framework Dependencies**:
   ```bash
   npm install
   ```

## Running Tests with Allure

### iOS Tests

```bash
# Make sure script is executable
chmod +x ./scripts/run-ios-tests-with-allure.sh

# Run iOS tests with Allure reporting
npm run test:ios:allure
```

### Android Tests

```bash
# Make sure script is executable
chmod +x ./scripts/run-android-tests-with-allure.sh

# Run Android tests with Allure reporting
npm run test:android:allure
```

## Generating and Viewing Allure Reports

After running tests, generate and view the Allure report:

```bash
# Generate Allure report
npm run report

# Or manually:
allure generate allure-results -o allure-report --clean

# Open the report in your browser
allure open allure-report
```

## Report Structure

The Allure report includes:

1. **Overview Dashboard**:
   - Test pass/fail statistics
   - Execution time
   - Failure categories

2. **Suites View**:
   - Tests organized by feature files
   - Expandable test steps
   - Screenshots attached to failures

3. **Categories**:
   - Element not found errors
   - Appium errors
   - Timeout issues
   - General failures

4. **Timeline**:
   - Test execution timeline
   - Duration of each test

5. **Environment**:
   - Device details
   - OS version
   - Appium version
   - Node.js version

## Troubleshooting Allure Issues

### Issue: Screenshots Not Showing in Report

**Solution**:
1. Check that Allure results directory has write permissions
2. Verify the test is properly capturing screenshots
   - The `takeScreenshot` method in `world.ts` handles this
   - Screenshot files should be in the `allure-results` directory
3. Run the post-processing script manually:
   ```bash
   ./scripts/process-allure-results.sh
   ```

### Issue: Cucumber Steps Not Expandable

**Solution**:
1. Ensure tests are using the correct Allure reporter
2. Check that the hooks in `hooks.ts` are properly capturing step information
3. Regenerate the report with:
   ```bash
   allure generate allure-results -o allure-report --clean
   ```

### Issue: Missing Environment Information

**Solution**:
1. Check if `environment.properties` is created in `allure-results`
2. If missing, create it manually:
   ```bash
   echo "Platform=iOS" > allure-results/environment.properties
   echo "Device=iPhone 16 Plus" >> allure-results/environment.properties
   echo "Appium=3.0.1" >> allure-results/environment.properties
   ```

## For More Information

For complete setup instructions for running the entire framework on a new machine, refer to:
- [Quick Start Guide](./QUICKSTART.md)
- [Complete Setup Guide](./SETUP.md)

## Customizing Allure Reports

To customize Allure reports:

1. **Custom Categories**:
   - Edit `categories.json` in `allure-results`

2. **Custom Environment Properties**:
   - Edit `environment.properties` in `allure-results`

3. **Adding Custom Labels**:
   - Modify the test result JSON creation in `hooks.ts`
