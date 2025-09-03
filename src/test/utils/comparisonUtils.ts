/**
 * Utility for comparing values with different types
 */
export class ComparisonUtils {
  /**
   * Compare two values of any type
   * @param expected The expected value from API
   * @param actual The actual value from UI
   * @param options Comparison options
   * @returns true if values match according to comparison rules
   */
  public static compareValues(
    expected: any, 
    actual: any, 
    options: ComparisonOptions = {}
  ): { isEqual: boolean; details?: string } {
    // Handle undefined/null cases
    if (expected === undefined || expected === null) {
      return { 
        isEqual: actual === undefined || actual === null,
        details: actual === undefined || actual === null ? 
          undefined : `Expected null/undefined but got: ${actual}`
      };
    }
    
    // Get types
    const expectedType = typeof expected;
    const actualType = typeof actual;
    
    // Handle different types
    if (expectedType !== actualType) {
      // Special case: number as string
      if ((expectedType === 'number' && actualType === 'string') || 
          (expectedType === 'string' && actualType === 'number')) {
        return this.compareNumberString(expected, actual, options);
      }
      
      // Special case: boolean as string
      if ((expectedType === 'boolean' && actualType === 'string') || 
          (expectedType === 'string' && actualType === 'boolean')) {
        return this.compareBooleanString(expected, actual, options);
      }
      
      // Different types that we can't reconcile
      return { 
        isEqual: false, 
        details: `Type mismatch: expected ${expectedType}, got ${actualType}`
      };
    }
    
    // Handle based on type
    switch (expectedType) {
      case 'string':
        return this.compareStrings(expected, actual, options);
      case 'number':
        return this.compareNumbers(expected, actual, options);
      case 'boolean':
        return { 
          isEqual: expected === actual,
          details: expected === actual ? undefined : `Expected ${expected} but got ${actual}`
        };
      case 'object':
        if (Array.isArray(expected) && Array.isArray(actual)) {
          return this.compareArrays(expected, actual, options);
        } else if (expected instanceof Date && actual instanceof Date) {
          return this.compareDates(expected, actual, options);
        } else {
          return this.compareObjects(expected, actual, options);
        }
      default:
        return { 
          isEqual: expected === actual,
          details: expected === actual ? undefined : `Values do not match: ${expected} vs ${actual}`
        };
    }
  }
  
  /**
   * Compare strings with options for case sensitivity and whitespace handling
   */
  private static compareStrings(
    expected: string, 
    actual: string, 
    options: ComparisonOptions
  ): { isEqual: boolean; details?: string } {
    let expectedStr = expected;
    let actualStr = actual;
    
    // Apply transformations
    if (options.ignoreCase) {
      expectedStr = expectedStr.toLowerCase();
      actualStr = actualStr.toLowerCase();
    }
    
    if (options.trimWhitespace) {
      expectedStr = expectedStr.trim();
      actualStr = actualStr.trim();
    }
    
    // Handle partial matching
    if (options.partialMatch && actualStr.includes(expectedStr)) {
      return { isEqual: true };
    }
    
    const isEqual = expectedStr === actualStr;
    return { 
      isEqual,
      details: isEqual ? undefined : `Strings do not match: "${expected}" vs "${actual}"`
    };
  }
  
  /**
   * Compare numbers with optional tolerance
   */
  private static compareNumbers(
    expected: number, 
    actual: number, 
    options: ComparisonOptions
  ): { isEqual: boolean; details?: string } {
    // Use tolerance if specified
    if (options.tolerance !== undefined) {
      const diff = Math.abs(expected - actual);
      const isEqual = diff <= options.tolerance;
      return { 
        isEqual,
        details: isEqual ? undefined : `Number difference exceeds tolerance: ${expected} vs ${actual}, diff: ${diff}, tolerance: ${options.tolerance}`
      };
    }
    
    const isEqual = expected === actual;
    return { 
      isEqual,
      details: isEqual ? undefined : `Numbers do not match: ${expected} vs ${actual}`
    };
  }
  
  /**
   * Compare dates
   */
  private static compareDates(
    expected: Date, 
    actual: Date, 
    options: ComparisonOptions
  ): { isEqual: boolean; details?: string } {
    if (options.dateFormat) {
      // Compare formatted dates
      const expectedFormatted = this.formatDate(expected, options.dateFormat);
      const actualFormatted = this.formatDate(actual, options.dateFormat);
      return { 
        isEqual: expectedFormatted === actualFormatted,
        details: expectedFormatted === actualFormatted ? 
          undefined : `Dates don't match with format ${options.dateFormat}: ${expectedFormatted} vs ${actualFormatted}`
      };
    }
    
    // Compare timestamps with optional tolerance
    const expectedTime = expected.getTime();
    const actualTime = actual.getTime();
    
    if (options.dateToleranceMs !== undefined) {
      const diff = Math.abs(expectedTime - actualTime);
      const isEqual = diff <= options.dateToleranceMs;
      return { 
        isEqual,
        details: isEqual ? 
          undefined : `Date difference exceeds tolerance: ${expected.toISOString()} vs ${actual.toISOString()}, diff: ${diff}ms, tolerance: ${options.dateToleranceMs}ms`
      };
    }
    
    const isEqual = expectedTime === actualTime;
    return { 
      isEqual,
      details: isEqual ? 
        undefined : `Dates do not match: ${expected.toISOString()} vs ${actual.toISOString()}`
    };
  }
  
  /**
   * Compare arrays
   */
  private static compareArrays(
    expected: any[], 
    actual: any[], 
    options: ComparisonOptions
  ): { isEqual: boolean; details?: string } {
    // Check length if required
    if (!options.ignoreArrayLength && expected.length !== actual.length) {
      return { 
        isEqual: false,
        details: `Array length mismatch: expected ${expected.length}, got ${actual.length}`
      };
    }
    
    // Check if all items in expected array exist in actual array
    if (options.arrayContainsOnly) {
      const mismatchedItems = expected.filter(expectedItem => 
        !actual.some(actualItem => 
          this.compareValues(expectedItem, actualItem, options).isEqual
        )
      );
      
      return { 
        isEqual: mismatchedItems.length === 0,
        details: mismatchedItems.length === 0 ? 
          undefined : `Some expected items not found in actual array: ${JSON.stringify(mismatchedItems)}`
      };
    }
    
    // Default comparison (strict order)
    for (let i = 0; i < Math.min(expected.length, actual.length); i++) {
      const comparison = this.compareValues(expected[i], actual[i], options);
      if (!comparison.isEqual) {
        return { 
          isEqual: false,
          details: `Array element at index ${i} does not match: ${comparison.details}`
        };
      }
    }
    
    return { isEqual: true };
  }
  
  /**
   * Compare objects
   */
  private static compareObjects(
    expected: object, 
    actual: object, 
    options: ComparisonOptions
  ): { isEqual: boolean; details?: string } {
    // Handle null cases
    if (expected === null || actual === null) {
      return { 
        isEqual: expected === actual,
        details: expected === actual ? undefined : `One value is null but the other is not`
      };
    }
    
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    
    // Only compare the specified keys if provided
    const keysToCompare = options.keys || expectedKeys;
    
    // Check if all required keys exist in the actual object
    for (const key of keysToCompare) {
      if (!actualKeys.includes(key)) {
        return { 
          isEqual: false,
          details: `Key "${key}" missing from actual object`
        };
      }
      
      // Compare the values for this key
      const expectedValue = (expected as any)[key];
      const actualValue = (actual as any)[key];
      
      const comparison = this.compareValues(expectedValue, actualValue, options);
      if (!comparison.isEqual) {
        return { 
          isEqual: false,
          details: `Mismatch for key "${key}": ${comparison.details}`
        };
      }
    }
    
    return { isEqual: true };
  }
  
  /**
   * Compare a number with string representation
   */
  private static compareNumberString(
    expected: any, 
    actual: any, 
    options: ComparisonOptions
  ): { isEqual: boolean; details?: string } {
    let numExpected: number;
    let numActual: number;
    
    // Convert both to numbers
    if (typeof expected === 'string') {
      numExpected = Number(expected);
      numActual = typeof actual === 'number' ? actual : Number(actual);
    } else {
      numExpected = expected;
      numActual = Number(actual);
    }
    
    // Check if conversion was successful
    if (isNaN(numExpected) || isNaN(numActual)) {
      return { 
        isEqual: false,
        details: `Failed to convert to number for comparison: expected ${expected}, actual ${actual}`
      };
    }
    
    return this.compareNumbers(numExpected, numActual, options);
  }
  
  /**
   * Compare a boolean with string representation
   */
  private static compareBooleanString(
    expected: any, 
    actual: any, 
    options: ComparisonOptions
  ): { isEqual: boolean; details?: string } {
    let boolExpected: boolean;
    let boolActual: boolean;
    
    // Convert string to boolean
    if (typeof expected === 'string') {
      boolExpected = this.stringToBoolean(expected);
      boolActual = typeof actual === 'boolean' ? actual : this.stringToBoolean(String(actual));
    } else {
      boolExpected = expected;
      boolActual = this.stringToBoolean(String(actual));
    }
    
    const isEqual = boolExpected === boolActual;
    return { 
      isEqual,
      details: isEqual ? undefined : `Boolean values don't match: ${expected} vs ${actual}`
    };
  }
  
  /**
   * Convert string to boolean with various representations
   */
  private static stringToBoolean(str: string): boolean {
    const normalized = str.trim().toLowerCase();
    return ['true', 'yes', 'y', '1', 'on'].includes(normalized);
  }
  
  /**
   * Format date according to pattern
   */
  private static formatDate(date: Date, format: string): string {
    // Simple date formatter - for more complex formats use a library like date-fns
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
}

/**
 * Options for value comparison
 */
export interface ComparisonOptions {
  // String comparison options
  ignoreCase?: boolean;
  trimWhitespace?: boolean;
  partialMatch?: boolean;
  
  // Number comparison options
  tolerance?: number;
  
  // Date comparison options
  dateFormat?: string;
  dateToleranceMs?: number;
  
  // Array comparison options
  ignoreArrayLength?: boolean;
  arrayContainsOnly?: boolean;
  
  // Object comparison options
  keys?: string[];
}
