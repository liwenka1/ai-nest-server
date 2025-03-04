import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs'; // 新增导入
import { GenerationParams, GenerationResult } from './types';

@Injectable()
export class ImagesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async bigmodelGenerations(params: GenerationParams): Promise<GenerationResult> {
    const apiUrl = `${this.configService.get('BIGMODEL_API_BASE_URL')}/images/generations`;
    const apiKey = `${this.configService.get('BIGMODEL_API_KEY')}`;

    try {
      // 使用 lastValueFrom 替代 toPromise
      const response = await lastValueFrom(
        this.httpService.post<GenerationResult>(apiUrl, params, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        })
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data || { error: 'API request failed' },
        axiosError.response?.status || 500
      );
    }
  }

  async siliconflowGenerations(params: GenerationParams): Promise<GenerationResult> {
    const apiUrl = `${this.configService.get('SILICONFLOW_API_BASE_URL')}/images/generations`;
    const apiKey = `${this.configService.get('SILICONFLOW_API_KEY')}`;

    try {
      // 使用 lastValueFrom 替代 toPromise
      const response = await lastValueFrom(
        this.httpService.post<GenerationResult>(apiUrl, params, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        })
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data || { error: 'API request failed' },
        axiosError.response?.status || 500
      );
    }
  }
}
