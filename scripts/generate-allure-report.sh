#!/bin/bash
###########################################
# Allure Report Generator Script
# Generates and opens the Allure report
###########################################

cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

echo "=================================================="
echo "Generating Allure Report"
echo "=================================================="

# Check if allure command is available
if ! command -v allure &> /dev/null; then
  echo "Error: Allure command-line tool not found."
  echo ""
  echo "Please install Allure using one of the following methods:"
  echo ""
  echo "For macOS:"
  echo "  brew install allure"
  echo ""
  echo "For Windows:"
  echo "  scoop install allure"
  echo "  or"
  echo "  choco install allure-commandline"
  echo ""
  echo "For Linux:"
  echo "  sudo apt-add-repository ppa:qameta/allure"
  echo "  sudo apt-get update"
  echo "  sudo apt-get install allure"
  echo ""
  echo "Alternatively, use the Node.js version from your project:"
  echo "  npx allure-commandline generate allure-results -o allure-report --clean"
  echo "  npx allure-commandline open allure-report"
  echo ""
  
  # Try using npx as fallback
  echo "Attempting to use npx allure-commandline as fallback..."
  if command -v npx &> /dev/null; then
    echo "Generating report using npx allure-commandline..."
    npx allure-commandline generate allure-results -o allure-report --clean
    
    if [ $? -eq 0 ]; then
      echo "Opening report using npx allure-commandline..."
      npx allure-commandline open allure-report
      exit 0
    else
      echo "Failed to generate report with npx allure-commandline."
      exit 1
    fi
  else
    echo "npx not found. Please install Allure command-line tool."
    exit 1
  fi
fi

# Check if allure-results directory exists and has files
if [ ! -d "allure-results" ] || [ -z "$(ls -A allure-results 2>/dev/null)" ]; then
  echo "Error: No test results found in allure-results directory."
  echo "Please run tests with Allure reporting first using:"
  echo "  ./scripts/run-android-tests-with-allure.sh"
  echo "  or"
  echo "  ./scripts/run-ios-tests-with-allure.sh"
  exit 1
fi

# Ensure history is preserved
mkdir -p allure-report/history
if [ ! -d "allure-results/history" ]; then
  mkdir -p allure-results/history
fi

# Copy history from report to results if it exists
if [ -d "allure-report/history" ] && [ "$(ls -A allure-report/history 2>/dev/null)" ]; then
  echo "Preserving test history..."
  cp -R allure-report/history/* allure-results/history/ 2>/dev/null || :
fi

# Generate report
echo "Generating report from results in allure-results directory..."
allure generate allure-results -o allure-report --clean

# Open the report
echo "Opening Allure report in your browser..."
allure open allure-report
