import { Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';
import { expect } from 'chai';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { XMLParser } from 'fast-xml-parser';
import { JSDOM } from 'jsdom';

const logger = new Logger('ApiAdvancedSteps');
const ajv = new Ajv();
addFormats(ajv);

/**
 * Advanced API testing step definitions
 * These steps provide additional validation capabilities for more complex API tests
 */

// JSON Schema validation
Then('the response should match JSON schema:', function(this: TestWorld, docString: string) {
  logger.info('Validating JSON schema');
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available for validation');
  }
  
  try {
    const schema = JSON.parse(docString);
    const validate = ajv.compile(schema);
    const valid = validate(response.data);
    
    if (!valid) {
      logger.error('JSON Schema validation failed', validate.errors);
      throw new Error(`JSON Schema validation failed: ${JSON.stringify(validate.errors)}`);
    }
    
    logger.info('JSON Schema validation passed');
  } catch (error) {
    logger.error('Error in JSON schema validation', error);
    throw error;
  }
});

// Store response data for later use
Then('I store the response field {string} as {string}', function(this: TestWorld, field: string, variableName: string) {
  logger.info(`Storing response field ${field} as ${variableName}`);
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available');
  }
  
  // Handle array notation like "[0].id" to get id from first element
  let value: any;
  try {
    // Convert field path to proper JavaScript property access
    // Example: "[0].id" becomes response.data[0].id
    const fieldPath = field.replace(/\[(\d+)\]/g, '.$1'); // Convert [0] to .0
    const parts = fieldPath.split('.');
    
    let current: any = response.data;
    
    for (const part of parts) {
      if (current === undefined) break;
      if (part === '') continue; // Skip empty parts from leading dots
      current = current[part];
    }
    value = current;
  } catch (error: any) {
    logger.error(`Error accessing field '${field}'`, error);
    throw new Error(`Field '${field}' could not be accessed: ${error.message || 'Unknown error'}`);
  }
  
  if (value === undefined) {
    logger.debug(`Response data: ${JSON.stringify(response.data).substring(0, 200)}...`);
    throw new Error(`Field '${field}' not found in the response`);
  }
  
  this.setTestData(variableName, value);
  logger.debug(`Stored ${variableName} = ${value}`);
});

// Content type validation
Then('the response content type should be {string}', function(this: TestWorld, contentType: string) {
  logger.info(`Validating response content type: ${contentType}`);
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available');
  }
  
  const actualContentType = response.headers['content-type'] || '';
  expect(actualContentType).to.include(contentType, `Expected content type to include '${contentType}' but got '${actualContentType}'`);
});

// XML element validation
Then('the response should contain XML element {string} with value {string}', function(this: TestWorld, xpath: string, expectedValue: string) {
  logger.info(`Validating XML element ${xpath}`);
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available');
  }
  
  if (typeof response.data !== 'string') {
    throw new Error('Response data is not a string. Cannot parse as XML.');
  }
  
  try {
    const parser = new XMLParser({ ignoreAttributes: false });
    const xmlData = parser.parse(response.data);
    
    // Simple path extraction for demo purposes
    // In a real implementation, use a proper XPath library
    const pathParts = xpath.replace('//', '').split('/');
    let value = xmlData;
    
    for (const part of pathParts) {
      value = value[part];
      if (value === undefined) {
        throw new Error(`XML element '${xpath}' not found in the response`);
      }
    }
    
    expect(value).to.equal(expectedValue, `Expected XML element '${xpath}' to have value '${expectedValue}' but got '${value}'`);
  } catch (error) {
    logger.error('Error parsing XML', error);
    throw error;
  }
});

// HTML element validation
Then('the response should contain HTML element {string} with value {string}', function(this: TestWorld, selector: string, expectedValue: string) {
  logger.info(`Validating HTML element ${selector}`);
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available');
  }
  
  if (typeof response.data !== 'string') {
    throw new Error('Response data is not a string. Cannot parse as HTML.');
  }
  
  try {
    const dom = new JSDOM(response.data);
    const element = dom.window.document.querySelector(selector);
    
    if (!element) {
      throw new Error(`HTML element '${selector}' not found in the response`);
    }
    
    const actualValue = element.textContent?.trim();
    expect(actualValue).to.equal(expectedValue, `Expected HTML element '${selector}' to have value '${expectedValue}' but got '${actualValue}'`);
  } catch (error) {
    logger.error('Error parsing HTML', error);
    throw error;
  }
});
