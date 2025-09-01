#!/bin/bash
###########################################
# Common utilities for test scripts
# Contains shared functions and variables
###########################################

# Script directory - allows for relative paths regardless of where script is called from
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Color codes for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Common environment variables
export NODE_ENV=${NODE_ENV:-qa}
export TEST_ENV=${TEST_ENV:-qa}
export APPIUM_URL=${APPIUM_URL:-"http://localhost:4723"}

# Log functions for consistent output
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Function to ensure the TypeScript code is built
ensure_built() {
  log_info "Building TypeScript project..."
  cd "$PROJECT_ROOT" && npm run build
  if [ $? -ne 0 ]; then
    log_error "Build failed. Exiting."
    exit 1
  fi
  log_success "Build completed successfully"
}

# Function to clean Allure results
clean_allure_results() {
  if [ -d "$PROJECT_ROOT/allure-results" ]; then
    log_info "Cleaning previous Allure results..."
    rm -rf "$PROJECT_ROOT/allure-results"
  fi
  mkdir -p "$PROJECT_ROOT/allure-results"
  log_info "Allure results directory prepared"
}

# Function to print platform-specific requirements
print_platform_requirements() {
  local platform=$1
  
  echo "========================================================================"
  log_info "IMPORTANT: To run $platform tests, you need to have:"
  
  case "$platform" in
    "android")
      echo "1. Android emulator running or physical device connected"
      echo "2. Appium server running at $APPIUM_URL"
      echo "3. UiAutomator2 driver installed (appium driver install uiautomator2)"
      echo "4. Demo app installed on the device"
      ;;
    "ios")
      echo "1. XCUITest driver installed: appium driver install xcuitest"
      echo "2. Xcode installed with iOS simulators"
      echo "3. iOS simulator iPhone 16 Plus running with UDID: A58EC5DC-3655-4B83-9C01-B0EC598E6A91"
      echo "4. The demo app installed on the simulator"
      ;;
    *)
      echo "Unknown platform: $platform"
      ;;
  esac
  
  echo "========================================================================"
}

# Function to run cucumber with standardized parameters
run_cucumber() {
  local tags=$1
  local profile=$2
  local additional_args=${3:-""}
  
  log_info "Running Cucumber with tags: $tags, profile: $profile"
  
  # Default arguments for all runs
  local cucumber_args="--require-module ts-node/register"
  
  # Determine which files to include based on compiled status
  if [ -d "$PROJECT_ROOT/dist" ] && [ -f "$PROJECT_ROOT/dist/test/support/hooks.js" ]; then
    cucumber_args="$cucumber_args --require dist/test/support/**/*.js --require dist/test/steps/**/*.js"
  else
    cucumber_args="$cucumber_args --require src/test/support/**/*.ts --require src/test/steps/**/*.ts"
  fi
  
  # Add profile if provided
  if [ -n "$profile" ]; then
    cucumber_args="$cucumber_args -p $profile"
  fi
  
  # Add tags if provided
  if [ -n "$tags" ]; then
    cucumber_args="$cucumber_args --tags \"$tags\""
  fi
  
  # Add additional arguments if provided
  if [ -n "$additional_args" ]; then
    cucumber_args="$cucumber_args $additional_args"
  fi
  
  # Add the feature files path
  cucumber_args="$cucumber_args src/test/features/**/*.feature"
  
  # Run cucumber with all arguments
  cd "$PROJECT_ROOT" && eval "npx cucumber-js $cucumber_args"
  
  # Capture the exit code
  local exit_code=$?
  if [ $exit_code -eq 0 ]; then
    log_success "Tests completed successfully"
  else
    log_error "Tests failed with exit code: $exit_code"
  fi
  
  return $exit_code
}
