import fs from 'fs';
import path from 'path';

/**
 * Utility class for storing and retrieving API responses
 */
export class ApiResponseStore {
  private static responseStore: Map<string, any> = new Map();
  private static readonly storePath = path.join(process.cwd(), 'api-responses');
  
  /**
   * Saves an API response with a given key
   * @param key Identifier for the API response
   * @param response The API response to store
   * @param persistToDisk Whether to also save the response to disk (default: true)
   */
  public static saveResponse(key: string, response: any, persistToDisk: boolean = true): void {
    // Store in memory
    this.responseStore.set(key, response);
    
    // Optionally store to disk for persistence between test runs
    if (persistToDisk) {
      this.saveResponseToDisk(key, response);
    }
  }
  
  /**
   * Retrieves an API response by its key
   * @param key Identifier for the API response
   * @returns The stored API response or undefined if not found
   */
  public static getResponse(key: string): any {
    // Try to get from memory first
    if (this.responseStore.has(key)) {
      return this.responseStore.get(key);
    }
    
    // If not in memory, try to load from disk
    return this.loadResponseFromDisk(key);
  }
  
  /**
   * Saves an API response to disk
   * @param key Identifier for the API response
   * @param response The API response to store
   */
  private static saveResponseToDisk(key: string, response: any): void {
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(this.storePath)) {
        fs.mkdirSync(this.storePath, { recursive: true });
      }
      
      // Sanitize key for filename
      const safeKey = key.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filePath = path.join(this.storePath, `${safeKey}.json`);
      
      // Save response as JSON
      fs.writeFileSync(filePath, JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(`Error saving API response to disk: ${error}`);
    }
  }
  
  /**
   * Loads an API response from disk
   * @param key Identifier for the API response
   * @returns The loaded API response or undefined if not found
   */
  private static loadResponseFromDisk(key: string): any {
    try {
      // Sanitize key for filename
      const safeKey = key.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filePath = path.join(this.storePath, `${safeKey}.json`);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return undefined;
      }
      
      // Load and parse JSON
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const response = JSON.parse(fileContent);
      
      // Store in memory for future access
      this.responseStore.set(key, response);
      
      return response;
    } catch (error) {
      console.error(`Error loading API response from disk: ${error}`);
      return undefined;
    }
  }
}
