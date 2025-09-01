# Mobile Test Framework Migration Guide

This document summarizes the key files and instructions to successfully migrate the mobile testing framework to another machine and ensure proper test execution with Allure reporting.

## Key Files for Migration

1. **Setup Documents**:
   - `SETUP.md` - Complete setup guide
   - `QUICKSTART.md` - Quick start instructions
   - `docs/ALLURE-REPORTING.md` - Allure reporting guide

2. **Test Execution Scripts**:
   - `scripts/run-ios-tests-with-allure.sh` - iOS test script
   - `scripts/run-android-tests-with-allure.sh` - Android test script
   - `scripts/process-allure-results.sh` - Allure results post-processing

3. **Framework Core**:
   - `src/test/support/world.ts` - Enhanced screenshot capture
   - `src/test/support/hooks.ts` - Test hooks with Allure integration

4. **Configuration Files**:
   - `.gitignore` - Git ignore rules
   - `package.json` - NPM scripts and dependencies

## Migration Steps Summary

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd ts-mobile-test-framework
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment**:
   - Install Node.js, Appium, and Allure
   - Configure mobile devices and simulators
   - Update device capabilities in config files

4. **Make Scripts Executable**:
   ```bash
   chmod +x ./scripts/*.sh
   ```

5. **Run Tests**:
   ```bash
   # For iOS
   npm run test:ios:allure
   
   # For Android
   npm run test:android:allure
   ```

6. **Generate Reports**:
   ```bash
   npm run report
   ```

7. **Fix Reporting Issues (if needed)**:
   ```bash
   npm run report:process
   npm run report
   ```

## Key Improvements Made

1. **Enhanced Screenshot Capture**:
   - Multiple attachment methods to ensure screenshots appear in reports
   - UUID generation for unique identification
   - Properties files for Allure compatibility

2. **Better Failure Reporting**:
   - Categorized failures for easier troubleshooting
   - Error message extraction and display
   - Step-by-step test execution details

3. **Post-Processing Capabilities**:
   - Standalone script to fix reporting issues
   - Automatic environment information collection
   - Report customization options

4. **Documentation**:
   - Comprehensive setup guides
   - Troubleshooting information
   - Detailed configuration instructions

## Contact Information

For any issues or questions during migration, please contact the framework maintainers.
