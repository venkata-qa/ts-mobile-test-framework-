import { Given, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';
import { expect } from 'chai';

const logger = new Logger('ApiValidationSteps');

/**
 * API Validation step definitions
 * These steps provide additional validation capabilities for response data
 */

/**
 * Validate that the response is an array
 */
Then('the response should be an array', async function(this: TestWorld) {
  logger.info('Validating that the response is an array');
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available for validation');
  }
  
  expect(Array.isArray(response.data)).to.be.true;
  logger.info(`Response is an array with ${response.data.length} items`);
});

/**
 * Validate that the response is an array with a minimum number of items
 */
Then('the response should be an array with at least {int} item(s)', async function(this: TestWorld, minItems: number) {
  logger.info(`Validating that the response is an array with at least ${minItems} item(s)`);
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available for validation');
  }
  
  expect(Array.isArray(response.data)).to.be.true;
  expect(response.data.length).to.be.at.least(minItems);
  logger.info(`Response is an array with ${response.data.length} items (minimum ${minItems})`);
});

/**
 * Validate that the response is an empty object
 */
Then('the response should be an empty object', async function(this: TestWorld) {
  logger.info('Validating that the response is an empty object');
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available for validation');
  }
  
  expect(typeof response.data).to.equal('object');
  expect(Object.keys(response.data).length).to.equal(0);
  logger.info('Response is an empty object');
});

/**
 * Validate that each item in an array response has the specified fields
 */
Then('each array item should contain the fields {string}', async function(this: TestWorld, fieldList: string) {
  logger.info(`Validating that each array item contains the fields: ${fieldList}`);
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available for validation');
  }
  
  expect(Array.isArray(response.data)).to.be.true;
  
  const fields = fieldList.split(',').map(field => field.trim());
  
  for (let i = 0; i < response.data.length; i++) {
    const item = response.data[i];
    for (const field of fields) {
      expect(item).to.have.property(field);
    }
  }
  
  logger.info(`All ${response.data.length} array items contain the required fields: ${fieldList}`);
});

/**
 * Validate that each item in an array has a specific field with a specific value
 */
Then('each array item should have the field {string} with value {string}', async function(this: TestWorld, field: string, expectedValue: string) {
  logger.info(`Validating that each array item has the field "${field}" with value "${expectedValue}"`);
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available for validation');
  }
  
  expect(Array.isArray(response.data)).to.be.true;
  
  for (let i = 0; i < response.data.length; i++) {
    const item = response.data[i];
    expect(item).to.have.property(field);
    
    // Convert the expected value to the same type as the actual value for comparison
    let typedExpectedValue: any = expectedValue;
    
    if (typeof item[field] === 'number') {
      typedExpectedValue = Number(expectedValue);
    } else if (typeof item[field] === 'boolean') {
      typedExpectedValue = expectedValue.toLowerCase() === 'true';
    }
    
    expect(item[field]).to.equal(typedExpectedValue);
  }
  
  logger.info(`All ${response.data.length} array items have field "${field}" with value "${expectedValue}"`);
});

/**
 * Validate that the response contains a field matching a regex pattern
 */
Then('the response should contain the field {string} matching regex {string}', async function(this: TestWorld, field: string, pattern: string) {
  logger.info(`Validating that the field "${field}" matches regex pattern: ${pattern}`);
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available for validation');
  }
  
  // Handle nested fields using dot notation (e.g., "address.city")
  const fieldParts = field.split('.');
  let value = response.data;
  
  for (const part of fieldParts) {
    expect(value).to.have.property(part);
    value = value[part];
  }
  
  expect(value).to.be.a('string');
  
  try {
    // Clean up the pattern to handle escaped backslashes correctly
    // When a pattern like "\\w" comes from feature file, it becomes "\\\\w" in the string
    // We need to interpret it correctly for the RegExp constructor
    // This improved version handles all escaped special characters
    const cleanPattern = pattern.replace(/\\\\./g, (match) => {
      return match.slice(1); // Remove one level of escaping
    });
    
    logger.info(`Applying regex: ${cleanPattern} to value: ${value}`);
    const regex = new RegExp(cleanPattern);
    const result = regex.test(value);
    expect(result).to.be.true;
    logger.info(`Field "${field}" with value "${value}" matches regex pattern`);
  } catch (error: any) {
    logger.error(`Invalid regex pattern: ${pattern}`, error);
    throw new Error(`Invalid regex pattern: ${pattern} - ${error.message}`);
  }
  
  logger.info(`Field "${field}" with value "${value}" matches regex pattern`);
});

/**
 * Validate that the response matches a JSON schema
 */
Then('the response should match the following schema:', async function(this: TestWorld, schema: string) {
  logger.info('Validating response against JSON schema');
  
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available for validation');
  }
  
  try {
    // Import dynamically to avoid circular dependencies
    const Ajv = require('ajv');
    const addFormats = require('ajv-formats');
    
    const ajv = new Ajv();
    addFormats(ajv);
    
    const schemaObj = JSON.parse(schema);
    const validate = ajv.compile(schemaObj);
    const valid = validate(response.data);
    
    if (!valid) {
      logger.error('Schema validation errors:', validate.errors);
      throw new Error(`JSON Schema validation failed: ${JSON.stringify(validate.errors)}`);
    }
    
    logger.info('Response successfully validated against schema');
  } catch (error) {
    logger.error('Error validating against schema', error);
    throw error;
  }
});
