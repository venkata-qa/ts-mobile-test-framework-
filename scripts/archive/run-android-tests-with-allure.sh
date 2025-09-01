#!/bin/bash
###########################################
# Android Test Runner with Allure Reporting
# Runs Android tests and generates Allure reports
###########################################

# Source common utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/common.sh"

# Set platform-specific environment variables
export PLATFORM=android
export DEVICE_NAME=${DEVICE_NAME:-"emulator-5554"}
export PLATFORM_VERSION=${PLATFORM_VERSION:-"16"}

# Print the header
log_info "Starting Android tests with Allure reporting"

# Print requirements
print_platform_requirements "android"

# Clean previous Allure results
clean_allure_results

# Build the project
ensure_built

# Run Android tests with Allure formatter
log_info "Running Android tests with Allure reporting..."
run_cucumber "@android or @androiddemo" "android" "--format @cucumber/pretty-formatter --format allure-cucumberjs"

# Store the exit code
TEST_EXIT_CODE=$?

# Post-process results to ensure all screenshots are properly attached
log_info "Post-processing Allure results..."

# Process any screenshots to ensure they have properties files
for file in allure-results/*.png; do
  if [ -f "$file" ] && [ ! -f "${file}.properties" ]; then
    filename=$(basename "$file")
    uuid=$(uuidgen || date +"%Y%m%d%H%M%S")
    
    # Create properties file
    echo "name=${filename%.png}" > "${file}.properties"
    echo "type=image/png" >> "${file}.properties"
    echo "source=true" >> "${file}.properties"
    echo "uuid=${uuid}" >> "${file}.properties"
    
    # Create a special JSON file for Allure to recognize this attachment
    echo "{
  \"name\": \"${filename%.png}\",
  \"source\": \"${filename}\",
  \"type\": \"image/png\",
  \"uuid\": \"${uuid}\"
}" > "allure-results/${uuid}-attachment.json"
    
    echo "Enhanced screenshot attachment: ${filename}"
  fi
done

# Find all result JSON files and ensure they reference screenshots
for resultFile in allure-results/*-result.json; do
  if [ -f "$resultFile" ]; then
    # Look for PNG files with similar names
    resultBase=$(basename "$resultFile" | cut -d'-' -f1)
    for imgFile in allure-results/*${resultBase}*.png; do
      if [ -f "$imgFile" ]; then
        imgName=$(basename "$imgFile")
        # If image exists but isn't in the result file, add it via a temp file
        if ! grep -q "$imgName" "$resultFile"; then
          echo "Linking screenshot $imgName to result $resultFile"
          # Create a temporary copy
          cp "$resultFile" "$resultFile.tmp"
          # Add attachment entry before the last closing brace
          sed -i.bak '/"attachments":\s*\[\]/s/\[\]/\[\{"name":"Screenshot", "source":"'$imgName'", "type":"image\/png"\}\]/' "$resultFile.tmp"
          # If already has attachments, add to the array
          sed -i.bak '/"attachments":\s*\[[^]]/s/\]/,{"name":"Screenshot", "source":"'$imgName'", "type":"image\/png"}\]/' "$resultFile.tmp"
          # Replace original
          mv "$resultFile.tmp" "$resultFile"
          # Clean up
          rm -f "$resultFile.tmp.bak"
        fi
      fi
    done
  fi
done

# Create environment properties file for Allure
echo "Creating environment.properties..."
echo "Platform=Android" > allure-results/environment.properties
echo "Device=Pixel 5" >> allure-results/environment.properties
echo "Android=13" >> allure-results/environment.properties
echo "Appium=3.0.1" >> allure-results/environment.properties
echo "Node=$(node -v)" >> allure-results/environment.properties
echo "OS=$(uname -s)" >> allure-results/environment.properties
echo "Framework=Cucumber-TypeScript" >> allure-results/environment.properties
echo "TestType=Android E2E" >> allure-results/environment.properties

# Create detailed executor.json for Allure
echo "Creating executor information..."
echo '{
  "name": "GitHub Actions",
  "type": "github",
  "reportName": "Android Automation Tests",
  "buildName": "Mobile E2E Test Suite",
  "buildUrl": "https://github.com/workflow-runs",
  "reportUrl": "https://reports.example.com",
  "icon": "fa-android"
}' > allure-results/executor.json

# Create categories for Allure report
echo "Creating categories.json..."
echo '[
  {
    "name": "Failed Tests",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*"
  },
  {
    "name": "Broken Tests",
    "matchedStatuses": ["broken"],
    "messageRegex": ".*"
  },
  {
    "name": "Ignored Tests",
    "matchedStatuses": ["skipped"],
    "messageRegex": ".*"
  },
  {
    "name": "Element not found",
    "matchedStatuses": ["failed", "broken"],
    "messageRegex": ".*No such element.*|.*NoSuchElement.*|.*The element could not be found.*"
  },
  {
    "name": "Appium Errors",
    "matchedStatuses": ["failed", "broken"],
    "messageRegex": ".*Appium.*error.*|.*WebDriverError.*"
  },
  {
    "name": "Timeout Issues",
    "matchedStatuses": ["failed", "broken"],
    "messageRegex": ".*timeout.*|.*Timed out.*|.*wait.*exceeded.*"
  }
]' > allure-results/categories.json

echo "Processing completed successfully."
echo "To generate the report, run: allure generate allure-results -o allure-report --clean"
echo "To view the report in a browser, run: allure open allure-report"

exit $TEST_EXIT_CODE
