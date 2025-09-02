#!/bin/bash
###########################################
# API Test Runner
# Runs API tests with specified tags
###########################################

# Source common utilities if available
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ -f "$SCRIPT_DIR/common.sh" ]; then
  source "$SCRIPT_DIR/common.sh"
  HAS_COMMON=1
else
  HAS_COMMON=0
fi

# Default tags
TAGS=${1:-"@questionnaire and not @mobile and not @android and not @ios"}

# Set environment
export TEST_ENV=${TEST_ENV:-"qa"}

# Print banner
echo "=================================================="
echo "Running API tests with tags: $TAGS"
echo "Running with environment: $TEST_ENV"
echo "=================================================="

# Helper to log in color if common.sh was sourced
function log_info() {
  if [ $HAS_COMMON -eq 1 ]; then
    print_info "$1"
  else
    echo "$1"
  fi
}

# Build TypeScript project
log_info "Building TypeScript project..."
npm run build

# Create directories if they don't exist
mkdir -p reports
mkdir -p allure-results

# Run API tests - be specific about which support files to load
log_info "Running API tests..."
npx cucumber-js --tags "$TAGS" \
  --require-module ts-node/register \
  --require src/test/support/world.ts \
  --require src/test/support/apiHooks.ts \
  --require src/core/utils/logger.ts \
  --require src/core/utils/config-manager.ts \
  --require src/api/apiClient.ts \
  --require src/test/steps/api/**/*.ts \
  --format progress \
  --format json:reports/api-report.json \
  --publish-quiet

# Capture the exit code
TEST_EXIT_CODE=$?
log_info "API test execution completed with exit code: $TEST_EXIT_CODE"

# Generate Allure report if allure command is available
if command -v allure &> /dev/null; then
  log_info "Generating Allure report..."
  allure generate --clean allure-results -o allure-report
  log_info "Allure report generated in allure-report directory"
fi

# Exit with the status from the test run
exit $TEST_EXIT_CODE
