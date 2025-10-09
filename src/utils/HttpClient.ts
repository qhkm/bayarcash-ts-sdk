import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  ValidationException,
  NotFoundException,
  FailedActionException,
  RateLimitExceededException,
  TimeoutException,
} from '../exceptions';

export class HttpClient {
  private client: AxiosInstance;
  private timeout: number = 30000; // 30 seconds default

  constructor(baseURL: string, token: string, timeout?: number) {
    if (timeout) {
      this.timeout = timeout;
    }

    this.client = axios.create({
      baseURL,
      timeout: this.timeout,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Update the base URL and reinitialize the client
   */
  public setBaseURL(baseURL: string, token: string): void {
    this.client = axios.create({
      baseURL,
      timeout: this.timeout,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Set request timeout
   */
  public setTimeout(timeout: number): void {
    this.timeout = timeout;
    this.client.defaults.timeout = timeout;
  }

  /**
   * Get current timeout
   */
  public getTimeout(): number {
    return this.timeout;
  }

  /**
   * Make a GET request
   */
  public async get<T = any>(uri: string): Promise<T> {
    return this.request<T>('GET', uri);
  }

  /**
   * Make a POST request
   */
  public async post<T = any>(uri: string, payload: any = {}): Promise<T> {
    return this.request<T>('POST', uri, payload);
  }

  /**
   * Make a PUT request
   */
  public async put<T = any>(uri: string, payload: any = {}): Promise<T> {
    return this.request<T>('PUT', uri, payload);
  }

  /**
   * Make a DELETE request
   */
  public async delete<T = any>(uri: string, payload: any = {}): Promise<T> {
    return this.request<T>('DELETE', uri, payload);
  }

  /**
   * Make HTTP request
   */
  private async request<T>(method: string, uri: string, payload?: any): Promise<T> {
    try {
      const config: any = { method, url: uri };

      if (payload) {
        // Check if payload has json property (similar to PHP implementation)
        if (payload.json) {
          config.data = payload.json;
        } else if (Object.keys(payload).length > 0) {
          // Convert to form params
          config.data = payload;
          config.headers = {
            ...config.headers,
            'Content-Type': 'application/x-www-form-urlencoded',
          };
          // Convert object to URLSearchParams for form encoding
          const params = new URLSearchParams();
          Object.keys(payload).forEach((key) => {
            params.append(key, payload[key]);
          });
          config.data = params;
        }
      }

      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleRequestError(error);
      }
      throw error;
    }
  }

  /**
   * Handle request errors
   */
  private handleRequestError(error: AxiosError): never {
    const statusCode = error.response?.status;
    const responseData = error.response?.data;

    if (statusCode === 422) {
      throw new ValidationException(responseData as any);
    }

    if (statusCode === 404) {
      throw new NotFoundException();
    }

    if (statusCode === 400) {
      throw new FailedActionException(responseData);
    }

    if (statusCode === 429) {
      const resetAt = error.response?.headers['x-ratelimit-reset']
        ? parseInt(error.response.headers['x-ratelimit-reset'], 10)
        : undefined;
      throw new RateLimitExceededException(resetAt);
    }

    // Generic error
    const message = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;
    throw new Error(message);
  }

  /**
   * Retry a callback with timeout
   */
  public async retry<T>(
    timeoutSeconds: number,
    callback: () => Promise<T | null | false>,
    sleepSeconds: number = 5
  ): Promise<T> {
    const start = Date.now();
    const timeoutMs = timeoutSeconds * 1000;
    const sleepMs = sleepSeconds * 1000;

    while (true) {
      const result = await callback();

      if (result) {
        return result;
      }

      const elapsed = Date.now() - start;
      if (elapsed >= timeoutMs) {
        const output = result === null || result === false ? [] : [result];
        throw new TimeoutException(output);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, sleepMs));
    }
  }
}
