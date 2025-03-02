import { Injectable } from '@nestjs/common';
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

  async generations(params: GenerationParams): Promise<GenerationResponse> {
    const apiUrl = `${this.configService.get('API_BASE_URL')}/images/generations`;
    const apiKey = this.configService.get('API_KEY');

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

      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      // 类型安全处理
      const axiosError = error as AxiosError;
      return {
        status: axiosError.response?.status || 500,
        data: axiosError.response?.data || {
          error: 'API request failed',
          details: axiosError.message
        }
      };
    }
  }
}
