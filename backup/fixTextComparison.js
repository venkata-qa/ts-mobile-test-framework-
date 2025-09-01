/**
 * This script updates the mobileAssertSteps.js file to make text comparisons case-insensitive
 */
const fs = require('fs');
const path = require('path');

// Path to the mobileAssertSteps.js file
const mobileAssertStepsPath = path.join(
  __dirname,
  'src/test/steps/mobile/mobileAssertSteps.js'
);

// Read the current content
let content = fs.readFileSync(mobileAssertStepsPath, 'utf8');

// Find the text comparison code in the containsText method and make it case-insensitive
const oldTextComparison = `const elementText = await element.getText();
                    if (elementText !== expectedText) {
                        throw new Error("Element \\"".concat(elementName, "\\" in page \\"").concat(pageClassName, "\\" does not contain text \\"").concat(expectedText, "\\""));
                    }`;

const newTextComparison = `const elementText = await element.getText();
                    if (elementText.toLowerCase() !== expectedText.toLowerCase()) {
                        throw new Error("Element \\"".concat(elementName, "\\" in page \\"").concat(pageClassName, "\\" does not contain text \\"").concat(expectedText, "\\""));
                    }`;

content = content.replace(oldTextComparison, newTextComparison);

// Write the updated content back to the file
fs.writeFileSync(mobileAssertStepsPath, content, 'utf8');

console.log('mobileAssertSteps.js has been updated with case-insensitive text comparison');
