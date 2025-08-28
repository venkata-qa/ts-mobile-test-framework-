import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { injectable } from 'tsyringe';
import { Logger } from '../core/utils/logger';
import { ConfigManager } from '../core/utils/config-manager';

/**
 * HTTP methods supported by the API client
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

/**
 * Response object returned by the API client
 */
export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
  requestTime: number;
  requestUrl: string;
  requestMethod: HttpMethod;
}

/**
 * API client for making HTTP requests
 * Provides a wrapper around Axios with additional functionality
 */
@injectable()
export class ApiClient {
  private client: AxiosInstance;
  private logger: Logger;
  private configManager: ConfigManager;
  private requestTimings: Map<string, number> = new Map();
  
  constructor() {
    this.logger = new Logger('ApiClient');
    this.configManager = new ConfigManager();
    this.client = this.createClient();
  }
  
  /**
   * Create and configure the axios client
   * @returns Configured axios instance
   */
  private createClient(): AxiosInstance {
    const baseUrl = this.configManager.get<string>('baseApiUrl', '');
    
    const client = axios.create({
      baseURL: baseUrl,
      timeout: this.configManager.get<number>('apiTimeout', 30000),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      validateStatus: (status) => {
        // Accept all status codes to handle them in the response interceptor
        return true;
      }
    });
    
    this.setupInterceptors(client);
    
    return client;
  }
  
  /**
   * Set up request and response interceptors
   */
  private setupInterceptors(client: AxiosInstance): void {
    // Request interceptor
    client.interceptors.request.use(
      (config) => {
        // Create a unique request ID
        const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Store request start time
        this.requestTimings.set(requestId, Date.now());
        
        // Add request ID as a custom header for tracking
        config.headers = config.headers || {};
        config.headers['X-Request-ID'] = requestId;
        
        // Log request details
        this.logger.info(
          `API Request: ${config.method?.toUpperCase() || 'UNKNOWN'} ${config.url}`,
          { 
            headers: this.sanitizeHeaders(config.headers || {}),
            params: config.params,
            data: config.data
          }
        );
        
        return config;
      },
      (error) => {
        this.logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    client.interceptors.response.use(
      (response) => {
        const requestId = response.config.headers?.['X-Request-ID'] as string;
        const startTime = this.requestTimings.get(requestId) || Date.now();
        const duration = Date.now() - startTime;
        
        this.logger.debug(
          `API Response: ${response.status} ${response.config.url} (${duration}ms)`, 
          response.data
        );
        
        this.requestTimings.delete(requestId);
        return response;
      },
      (error) => {
        if (error.response && error.config) {
          const requestId = error.config.headers?.['X-Request-ID'] as string;
          const startTime = this.requestTimings.get(requestId) || Date.now();
          const duration = Date.now() - startTime;
          
          this.logger.error(
            `API Error: ${error.response.status} ${error.config.url} (${duration}ms)`,
            error.response.data
          );
          
          this.requestTimings.delete(requestId);
        } else {
          this.logger.error('API Error without response', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Set the base URL for API requests
   * @param url The base URL
   */
  setBaseUrl(url: string): void {
    this.client.defaults.baseURL = url;
    this.logger.info(`Set base URL to: ${url}`);
  }

  /**
   * Set a global header for all requests
   * @param name Header name
   * @param value Header value
   */
  setHeader(name: string, value: string): void {
    this.client.defaults.headers.common[name] = value;
  }
  
  /**
   * Set authorization header
   * @param token The authorization token
   * @param scheme The auth scheme (e.g., 'Bearer')
   */
  setAuthToken(token: string, scheme = 'Bearer'): void {
    this.client.defaults.headers.common['Authorization'] = `${scheme} ${token}`;
  }
  
  /**
   * Perform a GET request
   * @param url API endpoint URL
   * @param params URL query parameters
   * @param config Additional axios config
   * @returns API response
   */
  async get<T = any>(
    url: string, 
    params?: Record<string, any>, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      // For ReqRes API, use native fetch API for GET requests
      const baseUrl = this.client.defaults.baseURL || '';
      const fullUrl = new URL(url, baseUrl);
      
      // Add query params if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          fullUrl.searchParams.append(key, String(value));
        });
      }
      
      const startTime = Date.now();
      // Create headers for the fetch request
      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
      
      // Add any common headers from axios client
      if (this.client.defaults.headers.common) {
        Object.entries(this.client.defaults.headers.common).forEach(([key, value]) => {
          if (value !== undefined && typeof value === 'string') {
            headers.append(key, value);
          }
        });
      }
      
      const response = await fetch(fullUrl.toString(), {
        method: 'GET',
        headers
      });
      
      const duration = Date.now() - startTime;
      const data = await response.json();
      
      // Log the response
      this.logger.debug(`API Response: ${response.status} ${fullUrl} (${duration}ms)`, data);
      
      // Create an ApiResponse object
      return {
        status: response.status,
        data,
        headers: Object.fromEntries(response.headers.entries()),
        requestTime: duration,
        requestUrl: url,
        requestMethod: HttpMethod.GET
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Perform a POST request
   * @param url API endpoint URL
   * @param data Request body data
   * @param config Additional axios config
   * @returns API response
   */
  async post<T = any, D = any>(
    url: string, 
    data?: D, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return this.formatResponse<T>(response, HttpMethod.POST, url);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Perform a PUT request
   * @param url API endpoint URL
   * @param data Request body data
   * @param config Additional axios config
   * @returns API response
   */
  async put<T = any, D = any>(
    url: string, 
    data?: D, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return this.formatResponse<T>(response, HttpMethod.PUT, url);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Perform a PATCH request
   * @param url API endpoint URL
   * @param data Request body data
   * @param config Additional axios config
   * @returns API response
   */
  async patch<T = any, D = any>(
    url: string, 
    data?: D, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return this.formatResponse<T>(response, HttpMethod.PATCH, url);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Perform a DELETE request
   * @param url API endpoint URL
   * @param config Additional axios config
   * @returns API response
   */
  async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return this.formatResponse<T>(response, HttpMethod.DELETE, url);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Format the axios response to our ApiResponse interface
   * @param axiosResponse The response from axios
   * @param method The HTTP method used
   * @param url The requested URL
   * @returns Formatted API response
   */
  /**
   * Sanitize headers to remove sensitive information before logging
   * @param headers Headers object to sanitize
   * @returns Sanitized headers
   */
  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie', 'set-cookie'];
    const sanitized = { ...headers };
    
    for (const key of Object.keys(sanitized)) {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '******';
      }
    }
    
    return sanitized;
  }
  
  /**
   * Format the axios response to our ApiResponse interface
   * @param axiosResponse The response from axios
   * @param method The HTTP method used
   * @param url The requested URL
   * @returns Formatted API response
   */
  private formatResponse<T>(
    axiosResponse: AxiosResponse<T>, 
    method: HttpMethod,
    url: string
  ): ApiResponse<T> {
    const requestId = axiosResponse.config.headers?.['X-Request-ID'] as string;
    const startTime = this.requestTimings.get(requestId) || 0;
    const requestTime = startTime ? Date.now() - startTime : 0;
    
    return {
      status: axiosResponse.status,
      data: axiosResponse.data,
      headers: axiosResponse.headers as Record<string, string>,
      requestTime,
      requestUrl: url,
      requestMethod: method
    };
  }
  
  /**
   * Handle and format API errors
   * @param error The error thrown by axios
   * @returns Formatted error with additional context
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 0;
      const url = error.config?.url || '';
      const method = error.config?.method?.toUpperCase() || '';
      const data = error.response?.data || '';
      
      const errorMessage = `API Error (${status}) for ${method} ${url}: ${error.message}`;
      const enhancedError = new Error(errorMessage);
      
      // Add additional properties to the error
      (enhancedError as any).status = status;
      (enhancedError as any).data = data;
      (enhancedError as any).url = url;
      (enhancedError as any).method = method;
      
      return enhancedError;
    }
    
    return error;
  }
}
