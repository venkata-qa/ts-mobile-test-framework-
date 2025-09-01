#!/bin/bash
# Script to process Allure results for better reporting
# Particularly fixes issues with screenshots not being properly attached

echo "Starting Allure results post-processing..."

# Check if allure-results directory exists
if [ ! -d "allure-results" ]; then
  echo "Error: allure-results directory not found. Please run tests before processing."
  exit 1
fi

# Process any screenshots to ensure they have properties files
for file in allure-results/*.png; do
  if [ -f "$file" ] && [ ! -f "${file}.properties" ]; then
    filename=$(basename "$file")
    uuid=$(uuidgen || date +"%Y%m%d%H%M%S")
    
    echo "Processing screenshot: ${filename}"
    
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
    # Get test ID from result file name
    testId=$(basename "$resultFile" | sed 's/-result.json//')
    
    # Look for PNG files with similar names
    for imgFile in allure-results/*${testId}*.png allure-results/FAILED*.png; do
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

# Create or update environment.properties if missing
if [ ! -f "allure-results/environment.properties" ]; then
  echo "Creating environment.properties file..."
  echo "Platform=$(test -n "$PLATFORM" && echo "$PLATFORM" || echo "Unknown")" > allure-results/environment.properties
  echo "Device=$(test -n "$DEVICE_NAME" && echo "$DEVICE_NAME" || echo "Test Device")" >> allure-results/environment.properties
  echo "Appium=3.0.1" >> allure-results/environment.properties
  echo "Node=$(node -v)" >> allure-results/environment.properties
  echo "OS=$(uname -s)" >> allure-results/environment.properties
  echo "Framework=Cucumber-TypeScript" >> allure-results/environment.properties
  echo "TestType=Mobile E2E" >> allure-results/environment.properties
fi

# Create or update categories.json if missing
if [ ! -f "allure-results/categories.json" ]; then
  echo "Creating categories.json file..."
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
fi

# Create executor.json if missing
if [ ! -f "allure-results/executor.json" ]; then
  echo "Creating executor.json file..."
  echo '{
  "name": "Local Execution",
  "type": "local",
  "reportName": "Mobile Test Report",
  "buildName": "Mobile E2E Test Suite",
  "icon": "fa-mobile"
}' > allure-results/executor.json
fi

echo "Processing completed. You can now generate the Allure report with:"
echo "allure generate allure-results -o allure-report --clean"
echo "allure open allure-report"

exit 0
