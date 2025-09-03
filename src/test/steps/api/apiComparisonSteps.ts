import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { ApiResponseStore } from '../../utils/apiResponseStore';
import { ComparisonUtils, ComparisonOptions } from '../../utils/comparisonUtils';
import get from 'lodash.get';

/**
 * Step definitions for saving and comparing API responses with UI elements
 */

/**
 * Saves the current API response with a specified key
 * @example I save the initial response for "UserProfile"
 * @example I save the API response as "userProfile"
 */
Given('I save the initial response for {string}', function(this: any, key: string) {
  // Assuming the last API response is stored in a known property of the world object
  const response = this.apiResponse || this.response;
  
  if (!response) {
    throw new Error('No API response found to save. Make sure an API request was made first.');
  }
  
  ApiResponseStore.saveResponse(key, response);
  this.log(`Saved API response as "${key}"`);
});

Given('I save the API response as {string}', function(this: any, key: string) {
  // Alias to the above step for compatibility
  const response = this.apiResponse || this.response;
  
  if (!response) {
    throw new Error('No API response found to save. Make sure an API request was made first.');
  }
  
  ApiResponseStore.saveResponse(key, response);
  this.log(`Saved API response as "${key}"`);
});

/**
 * Saves a specific part of the API response with a specified key
 * @example I save the API response property "data.user.name" as "userName"
 */
Given('I save the API response property {string} as {string}', function(this: any, jsonPath: string, key: string) {
  const response = this.apiResponse || this.response;
  
  if (!response) {
    throw new Error('No API response found to save. Make sure an API request was made first.');
  }
  
  const propertyValue = get(response, jsonPath);
  
  if (propertyValue === undefined) {
    throw new Error(`Property "${jsonPath}" not found in API response`);
  }
  
  ApiResponseStore.saveResponse(key, propertyValue);
  this.log(`Saved API response property "${jsonPath}" as "${key}"`);
});

/**
 * Verifies that a UI element's text matches a value from a saved API response
 * @example I verify the UI element "profileName" matches the API response "userProfile.name"
 */
Then('I verify the UI element {string} matches the API response {string}', async function(this: any, elementSelector: string, apiResponsePath: string) {
  // Parse the API response path into key and property path parts
  const [responseKey, ...pathParts] = apiResponsePath.split('.');
  const jsonPath = pathParts.join('.');
  
  // Get the saved API response
  const savedResponse = ApiResponseStore.getResponse(responseKey);
  if (!savedResponse) {
    throw new Error(`No API response found with key "${responseKey}"`);
  }
  
  // Get the expected value from the API response
  const expectedValue = jsonPath ? get(savedResponse, jsonPath) : savedResponse;
  if (expectedValue === undefined) {
    throw new Error(`Property "${jsonPath}" not found in API response with key "${responseKey}"`);
  }
  
  // Get the UI element using the browser object from world context
  const element = await this.browser.$(elementSelector);
  if (!await element.isExisting()) {
    throw new Error(`UI element "${elementSelector}" not found`);
  }
  
  // Get the text of the UI element
  const actualValue = await element.getText();
  
  // Compare values with default options
  const comparison = ComparisonUtils.compareValues(expectedValue, actualValue, {
    trimWhitespace: true,
    ignoreCase: true
  });
  
  expect(comparison.isEqual, comparison.details || `Expected "${expectedValue}" but got "${actualValue}"`).to.be.true;
  this.log(`UI element "${elementSelector}" matches API response "${apiResponsePath}"`);
});

/**
 * Verifies that a UI element's text matches a value from a saved API response with custom comparison options
 * @example I verify the UI element "price" matches the API response "productDetails.price" with tolerance 0.01
 */
Then('I verify the UI element {string} matches the API response {string} with {string} {string}', 
  async function(this: any, elementSelector: string, apiResponsePath: string, optionName: string, optionValue: string) {
    // Parse the API response path into key and property path parts
    const [responseKey, ...pathParts] = apiResponsePath.split('.');
    const jsonPath = pathParts.join('.');
    
    // Get the saved API response
    const savedResponse = ApiResponseStore.getResponse(responseKey);
    if (!savedResponse) {
      throw new Error(`No API response found with key "${responseKey}"`);
    }
    
    // Get the expected value from the API response
    const expectedValue = jsonPath ? get(savedResponse, jsonPath) : savedResponse;
    if (expectedValue === undefined) {
      throw new Error(`Property "${jsonPath}" not found in API response with key "${responseKey}"`);
    }
    
    // Get the UI element using the browser object from world context
    const element = await this.browser.$(elementSelector);
    if (!await element.isExisting()) {
      throw new Error(`UI element "${elementSelector}" not found`);
    }
    
    // Get the text of the UI element
    const actualValue = await element.getText();
    
    // Set comparison options based on parameters
    const options: ComparisonOptions = {
      trimWhitespace: true,
      ignoreCase: true
    };
    
    // Set the specific option based on the option name
    switch (optionName.toLowerCase()) {
      case 'tolerance':
        options.tolerance = parseFloat(optionValue);
        break;
      case 'dateformat':
        options.dateFormat = optionValue;
        break;
      case 'datetolerancems':
        options.dateToleranceMs = parseInt(optionValue);
        break;
      case 'partialmatch':
        options.partialMatch = optionValue.toLowerCase() === 'true';
        break;
      default:
        throw new Error(`Unsupported comparison option: ${optionName}`);
    }
    
    // Compare values with the specified options
    const comparison = ComparisonUtils.compareValues(expectedValue, actualValue, options);
    
    expect(comparison.isEqual, comparison.details || `Expected "${expectedValue}" but got "${actualValue}"`).to.be.true;
    this.log(`UI element "${elementSelector}" matches API response "${apiResponsePath}" with ${optionName}=${optionValue}`);
});

/**
 * Verifies that a UI element's attribute matches a value from a saved API response
 * @example I verify the UI element "productImage" attribute "src" matches the API response "product.imageUrl"
 * @example I verify the UI element "productImage" attribute "src" matches the API response "product.imageUrl" on the "ProductPage" page
 */
Then('I verify the UI element {string} attribute {string} matches the API response {string}', 
  async function(this: any, elementSelector: string, attributeName: string, apiResponsePath: string) {
    // Parse the API response path into key and property path parts
    const [responseKey, ...pathParts] = apiResponsePath.split('.');
    const jsonPath = pathParts.join('.');
    
    // Get the saved API response
    const savedResponse = ApiResponseStore.getResponse(responseKey);
    if (!savedResponse) {
      throw new Error(`No API response found with key "${responseKey}"`);
    }
    
    // Get the expected value from the API response
    const expectedValue = jsonPath ? get(savedResponse, jsonPath) : savedResponse;
    if (expectedValue === undefined) {
      throw new Error(`Property "${jsonPath}" not found in API response with key "${responseKey}"`);
    }
    
    // Get the UI element using the browser object from world context
    const element = await this.browser.$(elementSelector);
    if (!await element.isExisting()) {
      throw new Error(`UI element "${elementSelector}" not found`);
    }
    
    // Get the attribute value of the UI element
    const actualValue = await element.getAttribute(attributeName);
    
    // Compare values with default options
    const comparison = ComparisonUtils.compareValues(expectedValue, actualValue, {
      trimWhitespace: true,
      ignoreCase: true
    });
    
    expect(comparison.isEqual, comparison.details || `Expected "${expectedValue}" but got "${actualValue}" for attribute "${attributeName}"`).to.be.true;
    this.log(`UI element "${elementSelector}" attribute "${attributeName}" matches API response "${apiResponsePath}"`);
});

/**
 * Verifies that a UI element's attribute matches a value from a saved API response on a specific page
 */
Then('I verify the UI element {string} attribute {string} matches the API response {string} on the {string} page', 
  async function(this: any, elementSelector: string, attributeName: string, apiResponsePath: string, pageName: string) {
    // Parse the API response path into key and property path parts
    const [responseKey, ...pathParts] = apiResponsePath.split('.');
    const jsonPath = pathParts.join('.');
    
    // Get the saved API response
    const savedResponse = ApiResponseStore.getResponse(responseKey);
    if (!savedResponse) {
      throw new Error(`No API response found with key "${responseKey}"`);
    }
    
    // Get the expected value from the API response
    const expectedValue = jsonPath ? get(savedResponse, jsonPath) : savedResponse;
    if (expectedValue === undefined) {
      throw new Error(`Property "${jsonPath}" not found in API response with key "${responseKey}"`);
    }
    
    // Get the UI element using page object model if available
    let element;
    if (this.pageObjects && this.pageObjects[pageName]) {
      element = await this.pageObjects[pageName][elementSelector];
    } else {
      // Fallback to direct selector
      element = await this.browser.$(`${pageName.toLowerCase()} ${elementSelector}`);
    }
    
    if (!await element.isExisting()) {
      throw new Error(`UI element "${elementSelector}" not found on page "${pageName}"`);
    }
    
    // Get the attribute value of the UI element
    const actualValue = await element.getAttribute(attributeName);
    
    // Compare values with default options
    const comparison = ComparisonUtils.compareValues(expectedValue, actualValue, {
      trimWhitespace: true,
      ignoreCase: true
    });
    
    expect(comparison.isEqual, comparison.details || `Expected "${expectedValue}" but got "${actualValue}" for attribute "${attributeName}"`).to.be.true;
    this.log(`UI element "${elementSelector}" attribute "${attributeName}" on page "${pageName}" matches API response "${apiResponsePath}"`);
});

/**
 * Verifies that multiple UI elements match values from a saved API response using a data table
 * @example I verify the data of below elements to actual "UserProfile" data on the "ProfilePage" page
 *  | apiPath          | uiElement      |
 *  | $.name           | profileName    |
 *  | $.email          | profileEmail   |
 */
Then('I verify the data of below elements to actual {string} data on the {string} page', 
  async function(this: any, apiKey: string, pageName: string, dataTable: any) {
    // Get the API response
    const savedResponse = ApiResponseStore.getResponse(apiKey);
    if (!savedResponse) {
      throw new Error(`No API response found with key "${apiKey}"`);
    }
    
    // Get the rows from the data table
    const rows = dataTable.hashes();
    
    // Process each row
    for (const row of rows) {
      const apiPath = row.apiPath;
      const uiElement = row.uiElement;
      
      // Get the expected value from the API response
      const expectedValue = get(savedResponse, apiPath);
      if (expectedValue === undefined) {
        throw new Error(`Property "${apiPath}" not found in API response with key "${apiKey}"`);
      }
      
      // Get the UI element
      // Using the page object model pattern if it's available
      let element;
      if (this.pageObjects && this.pageObjects[pageName]) {
        element = await this.pageObjects[pageName][uiElement];
      } else {
        // Fallback to direct selector
        element = await this.browser.$(`${pageName.toLowerCase()} ${uiElement}`);
      }
      
      if (!await element.isExisting()) {
        throw new Error(`UI element "${uiElement}" not found on page "${pageName}"`);
      }
      
      // Get the text of the UI element
      const actualValue = await element.getText();
      
      // Compare values with default options
      const comparison = ComparisonUtils.compareValues(expectedValue, actualValue, {
        trimWhitespace: true,
        ignoreCase: true,
        partialMatch: true // Use partial match by default for this step
      });
      
      expect(comparison.isEqual, comparison.details || 
        `For ${uiElement}, expected "${expectedValue}" but got "${actualValue}"`).to.be.true;
      
      this.log(`UI element "${uiElement}" on page "${pageName}" matches API response path "${apiPath}"`);
    }
});
