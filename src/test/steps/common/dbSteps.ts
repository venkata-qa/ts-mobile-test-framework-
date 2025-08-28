import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../../support/world';
import { Logger } from '../../../core/utils/logger';
import { expect } from 'chai';

const logger = new Logger('DbSteps');

/**
 * Common steps for database testing
 * These steps handle database connections, queries, and data validation
 */

// In a full implementation, we would have a DbClient class similar to ApiClient
// For this example, we'll define placeholder steps that show the structure

// Database connection steps
Given('I connect to {string} database', function(this: TestWorld, dbName: string) {
  logger.info(`Connecting to database: ${dbName}`);
  
  // This would use a DbClient to establish connection
  // Example: this.dbClient.connect(dbName);
  
  this.setTestData('currentDb', dbName);
});

When('I execute SQL query:', async function(this: TestWorld, query: string) {
  logger.info('Executing SQL query');
  
  // This would use a DbClient to execute query
  // Example: const result = await this.dbClient.executeQuery(query);
  
  // For the example, store a mock result
  const mockResult = {
    rows: [
      { id: 1, name: 'Test User 1' },
      { id: 2, name: 'Test User 2' }
    ],
    rowCount: 2
  };
  
  this.setTestData('queryResult', mockResult);
});

When('I execute SQL update:', async function(this: TestWorld, query: string) {
  logger.info('Executing SQL update');
  
  // This would use a DbClient to execute update
  // Example: const result = await this.dbClient.executeUpdate(query);
  
  // For the example, store a mock result
  const mockResult = {
    affectedRows: 1
  };
  
  this.setTestData('updateResult', mockResult);
});

// Database validation steps
Then('the query should return {int} rows', function(this: TestWorld, expectedCount: number) {
  const queryResult = this.getTestData<any>('queryResult');
  
  if (!queryResult) {
    throw new Error('No query result found. Make sure a query was executed first.');
  }
  
  expect(queryResult.rowCount).to.equal(expectedCount);
});

Then('the query result should contain a row with values:', function(this: TestWorld, dataTable: any) {
  const queryResult = this.getTestData<any>('queryResult');
  
  if (!queryResult) {
    throw new Error('No query result found. Make sure a query was executed first.');
  }
  
  const expectedRow = dataTable.rowsHash();
  
  // Check if any row in the results matches all expected values
  const found = queryResult.rows.some((row: any) => {
    return Object.entries(expectedRow).every(([key, value]) => {
      return row[key] !== undefined && String(row[key]) === String(value);
    });
  });
  
  expect(found).to.be.true;
});

Then('the update should affect {int} rows', function(this: TestWorld, expectedCount: number) {
  const updateResult = this.getTestData<any>('updateResult');
  
  if (!updateResult) {
    throw new Error('No update result found. Make sure an update was executed first.');
  }
  
  expect(updateResult.affectedRows).to.equal(expectedCount);
});

// Database cleanup steps
When('I rollback the transaction', function(this: TestWorld) {
  logger.info('Rolling back transaction');
  // Example: await this.dbClient.rollback();
});

When('I commit the transaction', function(this: TestWorld) {
  logger.info('Committing transaction');
  // Example: await this.dbClient.commit();
});
