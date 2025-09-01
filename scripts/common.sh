#!/bin/bash
###########################################
# Common utility functions for test scripts
# Shared across API, mobile, and other test runners
###########################################

# Color definitions for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print functions for colored output
function print_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

function print_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

function print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

function print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check if the project is built and build it if not
function ensure_built() {
  if [ ! -d "./dist" ] || [ -z "$(ls -A ./dist 2>/dev/null)" ]; then
    print_info "Building project..."
    npm run build
  else
    print_info "Project already built, using existing build"
  fi
}

# Print platform-specific requirements
function print_platform_requirements() {
  local platform=$1
  
  case $platform in
    android)
      print_info "Android test requirements:"
      print_info "- Android emulator or device connected"
      print_info "- Appium server running"
      ;;
    ios)
      print_info "iOS test requirements:"
      print_info "- iOS simulator or device connected"
      print_info "- Appium server running"
      print_info "- WebDriverAgent installed"
      ;;
    api)
      print_info "API test requirements:"
      print_info "- Network connectivity to test endpoints"
      ;;
    *)
      print_info "Test requirements:"
      print_info "- Appropriate environment set up"
      ;;
  esac
}

# Run Cucumber with common settings
function run_cucumber() {
  local tags=$1
  local platform=$2
  local extra_args=$3
  
  print_info "Running tests with tags: $tags"
  
  # Base arguments that are common across all test runs
  local base_args="--require-module ts-node/register --publish-quiet"
  
  # Run Cucumber
  npx cucumber-js --tags "$tags" $base_args $extra_args
  
  # Return the exit code
  return $?
}

# Check if a command exists
function command_exists() {
  command -v "$1" &> /dev/null
}

# Generate and open an Allure report
function generate_allure_report() {
  if command_exists allure; then
    print_info "Generating Allure report..."
    allure generate --clean allure-results -o allure-report
    
    # Open the report if requested
    if [ "$1" == "open" ]; then
      print_info "Opening Allure report..."
      allure open allure-report
    else
      print_info "Allure report generated in allure-report directory"
    fi
  else
    print_warning "Allure command not found, skipping report generation"
  fi
}

# Print a divider line
function print_divider() {
  echo "=================================================="
}

# Print a header block
function print_header() {
  print_divider
  echo "$1"
  print_divider
}

# Export environment variable only if not already set
function export_default() {
  local name=$1
  local value=$2
  
  if [ -z "${!name}" ]; then
    export $name="$value"
  fi
}

# Print current environment settings
function print_environment() {
  print_info "Environment: $TEST_ENV"
  print_info "Platform: ${PLATFORM:-"not specified"}"
  if [ ! -z "$DEVICE_NAME" ]; then
    print_info "Device: $DEVICE_NAME"
  fi
}
