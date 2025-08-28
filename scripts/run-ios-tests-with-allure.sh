#!/bin/bash

# Set environment variables
export NODE_ENV=qa
export TEST_ENV=qa
export PLATFORM=ios
export APPIUM_URL="http://localhost:4723"
export ALLURE_RESULTS_DIR="./allure-results"

# Create directories for reports
mkdir -p allure-results
mkdir -p reports

# Print debug information
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "TEST_ENV: $TEST_ENV"
echo "PLATFORM: $PLATFORM"
echo "APPIUM_URL: $APPIUM_URL"
echo "ALLURE_RESULTS_DIR: $ALLURE_RESULTS_DIR"

# Clean allure results
echo "Cleaning previous Allure results..."
rm -rf allure-results/*

# Build the project
echo "Building project..."
npm run clean
npm run build

# Create environment.properties file for Allure
echo "Creating environment properties for Allure..."
cat > allure-results/environment.properties << EOF
Platform=iOS
DeviceName=iPhone 16 Plus
PlatformVersion=18.6
AutomationName=XCUITest
AppiumURL=${APPIUM_URL}
TestDate=$(date)
Framework=TypeScript Mobile Testing Framework
EOF

# Run iOS tests with our specialized hooks
echo "Running iOS tests with Allure reporting..."

# Create a dummy allure-results directory structure if it doesn't exist
mkdir -p allure-results/history

# Run the tests
npx cucumber-js -p ios

# Create categories for better test organization
echo "Creating test categories for Allure..."
cat > allure-results/categories.json << EOF
[
  {
    "name": "iOS Simulator Issues",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*simulator.*|.*xcuitest.*|.*Could not create simulator.*"
  },
  {
    "name": "Appium Connection Errors",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*Failed to create session.*|.*Connection refused.*"
  },
  {
    "name": "Element Interaction Issues",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*element.*not.*found.*|.*element.*not.*visible.*|.*element.*not.*clickable.*"
  }
]
EOF

# Post-process results to ensure all screenshots are properly attached
echo "Post-processing Allure results..."

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

# Generate detailed executor.json for better reporting
cat > allure-results/executor.json << EOF
{
  "name": "iOS Mobile Automation",
  "type": "cucumber",
  "reportName": "Blua Mobile iOS E2E Tests",
  "buildName": "iOS Tests - $(date +"%Y-%m-%d %H:%M:%S")",
  "buildOrder": "$(date +%s)",
  "buildUrl": "https://github.com/workflow-runs",
  "reportUrl": "https://reports.example.com/ios",
  "icon": "fa-apple"
}
EOF

# Generate trend data to show test history
mkdir -p allure-results/history
if [ -d "allure-report/history" ]; then
  echo "Copying previous history for trend data..."
  cp -r allure-report/history/* allure-results/history/
fi

# Generate Allure report
echo "Generating Allure report..."
npx allure generate --clean allure-results -o allure-report

# Open the report
echo "Opening Allure report..."
npx allure open allure-report
