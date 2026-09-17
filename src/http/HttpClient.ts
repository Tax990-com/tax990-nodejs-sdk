import axios, { AxiosInstance, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { v4 as uuidv4 } from 'uuid';
import { Tax990Error, AuthError, ValidationError, NotFoundError, RateLimitError } from '../errors';
import type { StructuredError } from '../types/form990n.types';

export interface HttpClientOptions {
  baseUrl: string;
  timeout?: number;
  getToken?: () => Promise<string>;
}

interface ErrorResponseData {
  StatusCode?: number;
  StatusNm?: string;
  StatusMessage?: string;
  CorrelationId?: string;
  Errors?: StructuredError[];
  statusCode?: number;
  status?: string;
  message?: string;
}

export class HttpClient {
  private readonly client: AxiosInstance;
  private readonly getToken?: () => Promise<string>;

  constructor(options: HttpClientOptions) {
    this.getToken = options.getToken;

    this.client = axios.create({
      baseURL: options.baseUrl,
      timeout: options.timeout ?? 30000,
      headers: {},
    });

    axiosRetry(this.client as any, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (err) =>
        axiosRetry.isNetworkError(err) ||
        (err.response?.status !== undefined && err.response.status >= 500) ||
        err.response?.status === 429,
    });

    this.client.interceptors.request.use((config) => {
      if (!config.headers['x-correlation-id']) {
        config.headers['x-correlation-id'] = uuidv4();
      }
      return config;
    });
  }

  async get<T>(
    path: string,
    params?: Record<string, string | undefined>,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    try {
      const headers = await this.buildHeaders(extraHeaders);
      const cleanParams = this.cleanParams(params);
      const res = await this.client.get<T>(path, { params: cleanParams, headers });
      return res.data;
    } catch (err) {
      throw mapError(err);
    }
  }

  async post<T>(
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    try {
      const headers = await this.buildHeaders(extraHeaders);
      const res = await this.client.post<T>(path, body, { headers: { 'Content-Type': 'application/json', ...headers } });
      return res.data;
    } catch (err) {
      throw mapError(err);
    }
  }

  async delete<T>(
    path: string,
    params?: Record<string, string | undefined>,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    try {
      const headers = await this.buildHeaders(extraHeaders);
      const cleanParams = this.cleanParams(params);
      const res = await this.client.delete<T>(path, { params: cleanParams, headers });
      return res.data;
    } catch (err) {
      throw mapError(err);
    }
  }

  private async buildHeaders(
    extra?: Record<string, string>,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = { ...extra };
    if (this.getToken) {
      const token = await this.getToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private cleanParams(
    params?: Record<string, string | undefined>,
  ): Record<string, string> {
    const clean: Record<string, string> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) clean[k] = v;
      }
    }
    return clean;
  }
}

function mapError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<ErrorResponseData>;
    const data = axErr.response?.data;
    const correlationId = data?.CorrelationId;
    const statusCode = axErr.response?.status ?? 500;
    const message =
      data?.StatusMessage ?? data?.message ?? axErr.message ?? 'Unknown error';

    let sdkErr: Tax990Error;
    if (statusCode === 401) sdkErr = new AuthError(message, correlationId);
    else if (statusCode === 404) sdkErr = new NotFoundError(message, correlationId);
    else if (statusCode === 429) sdkErr = new RateLimitError(message, correlationId);
    else if (statusCode === 400 && data?.Errors?.length) {
      sdkErr = new ValidationError(message, data.Errors, correlationId);
    } else {
      sdkErr = new Tax990Error(message, String(statusCode), statusCode, correlationId);
    }
    (sdkErr as any).responseData = data;
    throw sdkErr;
  }
  throw err;
}
