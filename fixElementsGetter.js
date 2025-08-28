/**
 * This script fixes the PageReflection.js file to handle elements stored in the elements getter method
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

// Find the getElementFromPage method and replace the check for direct properties
// with a check that also looks in the elements object
const searchString = `        try {
            // Check if it's a property getter
            if (typeof pageObject["get".concat(this.capitalizeFirstLetter(elementName))] === 'function') {
                return pageObject["get".concat(this.capitalizeFirstLetter(elementName))]();
            }
            // Check if it's a direct property
            if (elementName in pageObject) {
                return pageObject[elementName];
            }
            // Try to get via a getter method if it exists
            var getterMethodName = "get".concat(this.capitalizeFirstLetter(elementName));
            if (typeof pageObject[getterMethodName] === 'function') {
                return pageObject[getterMethodName]();
            }`;

const replacementString = `        try {
            // Check if it's a property getter
            if (typeof pageObject["get".concat(this.capitalizeFirstLetter(elementName))] === 'function') {
                return pageObject["get".concat(this.capitalizeFirstLetter(elementName))]();
            }
            // Check if it's a direct property
            if (elementName in pageObject) {
                return pageObject[elementName];
            }
            // Check if it's in the elements property
            if (typeof pageObject.elements === 'function' || typeof pageObject.elements === 'object') {
                const elements = typeof pageObject.elements === 'function' ? 
                    pageObject.elements() : pageObject.elements;
                
                if (elements && elementName in elements) {
                    return elements[elementName];
                }
            }
            // Try to get via a getter method if it exists
            var getterMethodName = "get".concat(this.capitalizeFirstLetter(elementName));
            if (typeof pageObject[getterMethodName] === 'function') {
                return pageObject[getterMethodName]();
            }`;

content = content.replace(searchString, replacementString);

// Write the updated content back to the file
fs.writeFileSync(pageReflectionPath, content, 'utf8');

console.log('PageReflection.js has been updated to handle elements in the elements getter method');
