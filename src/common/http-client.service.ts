import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

type ApiConfig = {
  baseUrl: string;
  apiKey: string;
};

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);

  constructor(private readonly httpService: HttpService) {}

  async request<T>(config: ApiConfig, endpoint: string, method: 'GET'): Promise<T>;

  async request<T, D>(config: ApiConfig, endpoint: string, method: 'POST', data: D): Promise<T>;

  async request<T = any, D = any>(
    config: ApiConfig,
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    data?: D
  ): Promise<T> {
    const url = `${config.baseUrl}${endpoint}`;
    const axiosConfig: AxiosRequestConfig<D> = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      ...(method === 'POST' && data && { data })
    };

    try {
      const response = await lastValueFrom(this.httpService.request<T>(axiosConfig));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(`API Request Failed: ${axiosError.message}`, axiosError.stack);

      const errorData = axiosError.response?.data || { error: 'API request failed' };
      const statusCode = axiosError.response?.status || 500;

      throw new HttpException(errorData, statusCode);
    }
  }
}
