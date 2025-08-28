import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
      duration?: number;
      [key: string]: any;
    };
  }
}
