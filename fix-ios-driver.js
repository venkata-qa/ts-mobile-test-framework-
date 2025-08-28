const fs = require('fs');
const path = require('path');

// Path to the compiled IOSDriver.js file
const iosDriverPath = path.join(__dirname, 'dist/core/driver/iosDriver.js');

console.log('Reading IOSDriver.js file...');
let content = fs.readFileSync(iosDriverPath, 'utf8');

console.log('Fixing IOSDriver.js...');

// Fix the syntax error in the overrideCapabilities object
const badCode = `const overrideCapabilities = {
                ''iPhone 16 Plus',
                ''18.6', // Use the available SDK version
                ''A58EC5DC-3655-4B83-9C01-B0EC598E6A91',
                ''/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app'
            };`;

const fixedCode = `const overrideCapabilities = {
                'appium:deviceName': 'iPhone 16 Plus',
                'appium:platformVersion': '18.6', // Use the available SDK version
                'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91',
                'appium:app': '/Users/venkorip5/Documents/vk-fws/bupa-blua-mobile-testx-e2e-testing/ts-mobile-test-framework/src/test/resources/app/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app'
            };`;

if (content.includes(badCode)) {
    content = content.replace(badCode, fixedCode);
    console.log('Fixed syntax error in IOSDriver.js');
} else {
    console.log('No syntax error found in IOSDriver.js or already fixed.');
}

// Make sure the platformVersion is set to 18.6 throughout the file
content = content.replace(/'appium:platformVersion':\s*['"]15\.0['"]/g, "'appium:platformVersion': '18.6'");
content = content.replace(/'platformVersion':\s*['"]15\.0['"]/g, "'platformVersion': '18.6'");
console.log('Ensured all platformVersion values are 18.6');

// Make sure the iPhone model is set to 'iPhone 16 Plus' throughout the file
content = content.replace(/'appium:deviceName':\s*['"]iPhone\s*\d+\s*[^'"]*/g, "'appium:deviceName': 'iPhone 16 Plus'");
content = content.replace(/'deviceName':\s*['"]iPhone\s*\d+\s*[^'"]*/g, "'deviceName': 'iPhone 16 Plus'");
console.log('Ensured all deviceName values are iPhone 16 Plus');

// Make sure the correct UDID is used
content = content.replace(/'appium:udid':\s*['"][^'"]*['"]/g, "'appium:udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91'");
content = content.replace(/'udid':\s*['"][^'"]*['"]/g, "'udid': 'A58EC5DC-3655-4B83-9C01-B0EC598E6A91'");
console.log('Ensured the correct UDID is used');

// Save the fixed file
fs.writeFileSync(iosDriverPath, content, 'utf8');
console.log('Successfully saved fixed IOSDriver.js file');

// Also fix the actual capabilities being used in the app

// Now update the run script to use our fix
const scriptPath = path.join(__dirname, 'scripts/run-ios-demo-test.sh');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Update the script to use our fix
if (!scriptContent.includes('fix-ios-driver.js')) {
    // Find the spot before running Cucumber
    const cucumberLine = 'npx cucumber-js -p ios';
    const fixLine = 'node fix-ios-driver.js';
    
    if (scriptContent.includes(cucumberLine)) {
        // Add our fix right before running cucumber-js
        scriptContent = scriptContent.replace(
            cucumberLine, 
            `# Apply direct fix to compiled IOSDriver.js\necho "Applying fix to compiled IOSDriver.js..."\n${fixLine}\n\n# Run tests\n${cucumberLine}`
        );
        fs.writeFileSync(scriptPath, scriptContent, 'utf8');
        console.log('Updated run-ios-demo-test.sh script to include our fix');
    } else {
        console.log('Could not find Cucumber execution line in the script');
    }
} else {
    console.log('Script already includes our fix');
}

console.log('All fixes applied successfully!');
