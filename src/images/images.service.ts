import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs'; // 新增导入

export interface GenerationParams {
  model: string;
  prompt: string;
  negative_prompt?: string;
  image_size: string;
  batch_size: number;
  seed: number;
  num_inference_steps: number;
  guidance_scale: number;
  image?: string;
}

export interface GenerationResponse {
  status: number;
  data: any;
}

@Injectable()
export class ImagesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async bigmodelGenerations(params: GenerationParams): Promise<GenerationResponse> {
    const apiUrl = `${this.configService.get('BIGMODEL_API_BASE_URL')}/images/generations`;
    const apiKey = `${this.configService.get('BIGMODEL_API_KEY')}`;

    try {
      // 使用 lastValueFrom 替代 toPromise
      const response = await lastValueFrom(
        this.httpService.post(apiUrl, params, {
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

  async siliconflowGenerations(params: GenerationParams): Promise<GenerationResponse> {
    const apiUrl = `${this.configService.get('SILICONFLOW_API_BASE_URL')}/images/generations`;
    const apiKey = `${this.configService.get('SILICONFLOW_API_KEY')}`;

    try {
      // 使用 lastValueFrom 替代 toPromise
      const response = await lastValueFrom(
        this.httpService.post(apiUrl, params, {
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
