#!/bin/bash
###########################################
# Test Runner Script
# A simplified script to run tests locally or on BrowserStack
###########################################

# Set default values
PLATFORM=${PLATFORM:-"android"}
ENV=${ENV:-"local"}
TAGS=${TAGS:-""} # Empty default to use the profile's default tags

# Help function
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --platform PLATFORM    Target platform (android, ios) [default: android]"
    echo "  --env ENV              Test environment (local, browserstack) [default: local]"
    echo "  --tags TAGS            Test tags to run [default: @smoke]"
    echo "  --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --platform android --env local --tags @regression"
    echo "  $0 --platform ios --env browserstack"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --platform)
            PLATFORM="$2"
            shift 2
            ;;
        --env)
            ENV="$2"
            shift 2
            ;;
        --tags)
            TAGS="$2"
            shift 2
            ;;
        --help)
            show_help
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            ;;
    esac
done

# Validate inputs
if [[ "$PLATFORM" != "android" && "$PLATFORM" != "ios" ]]; then
    echo "ERROR: Platform must be either 'android' or 'ios'"
    exit 1
fi

if [[ "$ENV" != "local" && "$ENV" != "browserstack" ]]; then
    echo "ERROR: Environment must be either 'local' or 'browserstack'"
    exit 1
fi

# Set environment variables
export TEST_ENV="qa"
export PLATFORM="$PLATFORM"

echo "=================================================="
echo "Running tests with the following configuration:"
echo "- Platform: $PLATFORM"
echo "- Environment: $ENV"
echo "- Tags: $TAGS"
echo "=================================================="

# Build TypeScript project
echo "Building TypeScript project..."
npm run build

# Set platform-specific configurations
if [[ "$PLATFORM" == "android" ]]; then
    if [[ "$ENV" == "local" ]]; then
        export DEVICE_NAME="emulator-5554"
        export PLATFORM_VERSION="16"
        export APPIUM_URL="http://localhost:4723"
    else
        # Load environment variables from .env file if it exists
        ENV_FILE="../.env"
        if [ -f "$ENV_FILE" ]; then
            echo "Loading BrowserStack credentials from .env file"
            set -a
            source "$ENV_FILE"
            set +a
        else
            echo "WARNING: .env file not found at $ENV_FILE. Make sure your BrowserStack credentials are set!"
        fi
        
        # BrowserStack Android config
        export BROWSERSTACK_APP_ID="${BROWSERSTACK_ANDROID_APP_ID}"
        export DEVICE_NAME="Google Pixel 7"
        export PLATFORM_VERSION="13.0"
        export APPIUM_URL="https://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub"
        
        echo "Using BrowserStack with username: $BROWSERSTACK_USERNAME"
        echo "Device: $DEVICE_NAME, Version: $PLATFORM_VERSION"
        echo "App ID: $BROWSERSTACK_APP_ID"
    fi
    
    # Run Android tests
    echo "Running Android tests..."
    
elif [[ "$PLATFORM" == "ios" ]]; then
    if [[ "$ENV" == "local" ]]; then
        export DEVICE_NAME="iPhone 16 Plus"
        export PLATFORM_VERSION="18.6"
        export UDID="A58EC5DC-3655-4B83-9C01-B0EC598E6A91"
        export APPIUM_URL="http://localhost:4723"
    else
        # Load environment variables from .env file if it exists
        ENV_FILE="../.env"
        if [ -f "$ENV_FILE" ]; then
            echo "Loading BrowserStack credentials from .env file"
            set -a
            source "$ENV_FILE"
            set +a
        else
            echo "WARNING: .env file not found at $ENV_FILE. Make sure your BrowserStack credentials are set!"
        fi
        
        # BrowserStack iOS config
        export BROWSERSTACK_APP_ID="${BROWSERSTACK_IOS_APP_ID}"
        export DEVICE_NAME="iPhone 14"
        export PLATFORM_VERSION="16"
        export APPIUM_URL="https://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub"
        
        echo "Using BrowserStack with username: $BROWSERSTACK_USERNAME"
        echo "Device: $DEVICE_NAME, Version: $PLATFORM_VERSION"
        echo "App ID: $BROWSERSTACK_APP_ID"
    fi
    
    # Run iOS tests
    echo "Running iOS tests..."
fi

# Run the tests
if [[ -n "$TAGS" ]]; then
    echo "Running tests with tags: $TAGS"
    TAGS_OPTION="--tags $TAGS"
else
    echo "Running tests with default profile tags"
    TAGS_OPTION=""
fi

# Specific feature file path
FEATURE_PATH="src/test/features/mobile/demo.feature"
echo "Running only specific feature: $FEATURE_PATH"

if [[ "$ENV" == "browserstack" ]]; then
    # Add browserstack-specific capabilities for BrowserStack
    echo "Running tests on BrowserStack..."
    npx cucumber-js --profile $PLATFORM $TAGS_OPTION --format progress $FEATURE_PATH
else
    # Local test execution
    echo "Running tests locally..."
    npx cucumber-js --profile $PLATFORM $TAGS_OPTION --format progress $FEATURE_PATH
fi

# Capture the exit code
TEST_EXIT_CODE=$?
echo "Test execution completed with exit code: $TEST_EXIT_CODE"

# Exit with the status from the test run
exit $TEST_EXIT_CODE
