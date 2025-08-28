import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';
import { expect } from 'chai';
import { isValidJSON } from '../../../core/utils/validators';

const logger = new Logger('ApiCommonSteps');

/**
 * Common API steps that can be used for any API testing
 * Simple, reusable step definitions with minimal complexity
 */

// Request Setup Steps

/**
 * Set the base URL for the API
 */
Given('I set API base URL to {string}', function(this: TestWorld, baseUrl: string) {
  logger.info(`Setting API base URL to: ${baseUrl}`);
  
  if (!this.apiClient) {
    this.initApiClient(baseUrl);
  } else {
    this.apiClient.setBaseUrl(baseUrl);
  }
});

/**
 * Set a request header
 */
Given('I set request header: {word}={word}', function(this: TestWorld, headerName: string, headerValue: string) {
  logger.info(`Setting request header: ${headerName}=${headerValue}`);
  if (!this.apiClient) {
    throw new Error('API client not initialized');
  }
  this.apiClient.setHeader(headerName, headerValue);
});

/**
 * Set request body from docstring
 */
Given('I set request body', function(this: TestWorld, body: string) {
  logger.info('Setting request body');
  if (!this.apiClient) {
    throw new Error('API client not initialized');
  }
  try {
    const parsedBody = JSON.parse(body);
    this.setTestData('requestBody', parsedBody);
  } catch (error) {
    logger.error('Invalid JSON in request body', error);
    throw new Error('Request body is not valid JSON');
  }
});

/**
 * Validate that response is valid JSON
 */
Then('the response should be valid JSON', function(this: TestWorld) {
  const response = this.getTestData<any>('lastResponse');
  if (!response) {
    throw new Error('No response data available');
  }
  
  try {
    // The response is already parsed by axios, so if we got here, it's valid JSON
    // We can also validate by converting back to string and checking
    const responseStr = JSON.stringify(response.data);
    expect(isValidJSON(responseStr)).to.be.true;
  } catch (error) {
    logger.error('Invalid JSON in response', error);
    throw new Error('Response body is not valid JSON');
  }
});
Given('I set request header {string} to {string}', function(this: TestWorld, headerName: string, headerValue: string) {
  logger.info(`Setting request header: ${headerName}=${headerValue}`);
  
  if (!this.apiClient) {
    throw new Error('API client is not initialized. Set the base URL first.');
  }
  
  this.apiClient.setHeader(headerName, headerValue);
});

/**
 * Set a query parameter
 */
Given('I set query parameter {string} to {string}', function(this: TestWorld, paramName: string, paramValue: string) {
  logger.info(`Setting query parameter: ${paramName}=${paramValue}`);
  
  const params = this.getTestData<Record<string, string>>('queryParams') || {};
  params[paramName] = paramValue;
  this.setTestData('queryParams', params);
});

/**
 * Set the request body from a JSON string
 */
Given('I set request body to:', function(this: TestWorld, docString: string) {
  logger.info('Setting request body');
  
  try {
    const body = JSON.parse(docString);
    this.setTestData('requestBody', body);
  } catch (error) {
    // If not valid JSON, use as raw string
    this.setTestData('requestBody', docString);
  }
});

// Request Execution Steps

/**
 * Send a GET request
 */
When('I send a GET request to {string}', async function(this: TestWorld, endpoint: string) {
  logger.info(`Sending GET request to: ${endpoint}`);
  
  if (!this.apiClient) {
    throw new Error('API client is not initialized. Set the base URL first.');
  }
  
  const params = this.getTestData<Record<string, string>>('queryParams');
  
  try {
    const response = await this.apiClient.get(endpoint, params);
    this.setTestData('lastResponse', response);
    logger.info(`Received response with status: ${response.status}`);
  } catch (error) {
    logger.error('Request failed', error);
    this.setTestData('lastError', error);
    throw error;
  }
});

/**
 * Send a POST request
 */
When('I send a POST request to {string}', async function(this: TestWorld, endpoint: string) {
  logger.info(`Sending POST request to: ${endpoint}`);
  
  if (!this.apiClient) {
    throw new Error('API client is not initialized. Set the base URL first.');
  }
  
  const body = this.getTestData<any>('requestBody');
  
  try {
    const response = await this.apiClient.post(endpoint, body);
    this.setTestData('lastResponse', response);
    logger.info(`Received response with status: ${response.status}`);
  } catch (error) {
    logger.error('Request failed', error);
    this.setTestData('lastError', error);
    throw error;
  }
});

/**
 * Send a PUT request
 */
When('I send a PUT request to {string}', async function(this: TestWorld, endpoint: string) {
  logger.info(`Sending PUT request to: ${endpoint}`);
  
  if (!this.apiClient) {
    throw new Error('API client is not initialized. Set the base URL first.');
  }
  
  const body = this.getTestData<any>('requestBody');
  
  try {
    const response = await this.apiClient.put(endpoint, body);
    this.setTestData('lastResponse', response);
    logger.info(`Received response with status: ${response.status}`);
  } catch (error) {
    logger.error('Request failed', error);
    this.setTestData('lastError', error);
    throw error;
  }
});

/**
 * Send a DELETE request
 */
When('I send a DELETE request to {string}', async function(this: TestWorld, endpoint: string) {
  logger.info(`Sending DELETE request to: ${endpoint}`);
  
  if (!this.apiClient) {
    throw new Error('API client is not initialized. Set the base URL first.');
  }
  
  try {
    const response = await this.apiClient.delete(endpoint);
    this.setTestData('lastResponse', response);
    logger.info(`Received response with status: ${response.status}`);
  } catch (error) {
    logger.error('Request failed', error);
    this.setTestData('lastError', error);
    throw error;
  }
});

// Response Validation Steps

/**
 * Check the response status code
 */
Then('the response status code should be {int}', function(this: TestWorld, expectedStatus: number) {
  const response = this.getTestData<any>('lastResponse');
  
  if (!response) {
    throw new Error('No response found. Make sure a request was sent first.');
  }
  
  expect(response.status).to.equal(expectedStatus);
});

/**
 * Check that a field exists in the response
 */
Then('the response should contain the field {string}', function(this: TestWorld, fieldPath: string) {
  const response = this.getTestData<any>('lastResponse');
  
  if (!response) {
    throw new Error('No response found. Make sure a request was sent first.');
  }
  
  // Get the value using path notation
  const pathParts = fieldPath.split('.');
  let value = response.data;
  
  for (const part of pathParts) {
    if (value === undefined || value === null) {
      throw new Error(`Field ${fieldPath} could not be found in the response`);
    }
    value = value[part];
  }
  
  expect(value).to.not.be.undefined;
});

/**
 * Check that a field has a specific value in the response
 */
Then('the response should contain the field {string} with value {string}', function(this: TestWorld, fieldPath: string, expectedValue: string) {
  const response = this.getTestData<any>('lastResponse');
  
  if (!response) {
    throw new Error('No response found. Make sure a request was sent first.');
  }
  
  // Get the value using path notation
  const pathParts = fieldPath.split('.');
  let value = response.data;
  
  for (const part of pathParts) {
    if (value === undefined || value === null) {
      throw new Error(`Field ${fieldPath} could not be found in the response`);
    }
    value = value[part];
  }
  
  // Convert expected value to appropriate type
  let typedExpectedValue: any = expectedValue;
  
  // Try to convert to number if it looks like a number
  if (/^-?\d+(\.\d+)?$/.test(expectedValue)) {
    typedExpectedValue = parseFloat(expectedValue);
  } else if (expectedValue === 'true') {
    typedExpectedValue = true;
  } else if (expectedValue === 'false') {
    typedExpectedValue = false;
  }
  
  expect(value).to.deep.equal(typedExpectedValue);
});

/**
 * Check that the response is an array with minimum length
 * @deprecated Use the step in apiValidationSteps.ts instead
 */
Then('the response array should contain at least {int} items', function(this: TestWorld, minCount: number) {
  const response = this.getTestData<any>('lastResponse');
  
  if (!response) {
    throw new Error('No response found. Make sure a request was sent first.');
  }
  
  expect(Array.isArray(response.data)).to.be.true;
  expect(response.data.length).to.be.at.least(minCount);
});

/**
 * Check that the response contains text
 */
Then('the response should contain text {string}', function(this: TestWorld, expectedText: string) {
  const response = this.getTestData<any>('lastResponse');
  
  if (!response) {
    throw new Error('No response found. Make sure a request was sent first.');
  }
  
  const responseText = JSON.stringify(response.data);
  expect(responseText).to.include(expectedText);
});

/**
 * Check response time
 */
Then('the response time should be less than {int} ms', function(this: TestWorld, maxTime: number) {
  const response = this.getTestData<any>('lastResponse');
  
  if (!response) {
    throw new Error('No response found. Make sure a request was sent first.');
  }
  
  expect(response.requestTime).to.be.at.most(maxTime);
});

/**
 * Set basic authentication
 */
Given('I set basic authentication with username {string} and password {string}', function(this: TestWorld, username: string, password: string) {
  logger.info(`Setting basic authentication with username: ${username}`);
  
  if (!this.apiClient) {
    throw new Error('API client not initialized');
  }
  
  // Set the Authorization header with Base64 encoded credentials
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  this.apiClient.setHeader('Authorization', `Basic ${credentials}`);
});
