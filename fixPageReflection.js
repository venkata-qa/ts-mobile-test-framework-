/**
 * This script fixes the PageReflection.js file to use the correct import path
 * for page objects, which are now in src/ui/pageObjects instead of the expected location.
 */
const fs = require('fs');
const path = require('path');

// Path to the PageReflection.js file
const pageReflectionPath = path.join(
  __dirname,
  'src/core/utils/pageReflection.js'
);

// Read the current content
let content = fs.readFileSync(pageReflectionPath, 'utf8');

// Replace the hardcoded import path with the correct one
const oldImportPath = '"../../../ui/pageObjects/".concat(pageClassName)';
const newImportPath = '"../../../src/ui/pageObjects/".concat(pageClassName)';

content = content.replace(oldImportPath, newImportPath);

// Write the updated content back to the file
fs.writeFileSync(pageReflectionPath, content, 'utf8');

console.log('PageReflection.js has been updated with the correct import path');
