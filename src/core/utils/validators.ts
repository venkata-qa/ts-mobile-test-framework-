/**
 * Utility functions for validations
 */

/**
 * Check if a string is valid JSON
 * @param jsonString The string to check
 * @returns boolean indicating if the string is valid JSON
 */
export const isValidJSON = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if a value is of a specific type
 * @param value The value to check
 * @param type The expected type
 * @returns boolean indicating if the value matches the expected type
 */
export const isOfType = (value: any, type: string): boolean => {
  switch (type.toLowerCase()) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'boolean':
      return typeof value === 'boolean';
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    case 'array':
      return Array.isArray(value);
    case 'null':
      return value === null;
    default:
      return false;
  }
};
