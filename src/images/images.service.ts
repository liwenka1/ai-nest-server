import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerationParams, GenerationResult } from './types';
import { ApiConfig, ApiType } from 'src/common/api.config';
import { HttpClientService } from 'src/common/http-client.service';

@Injectable()
export class ImagesService {
  private readonly apiConfig: ApiConfig;

  constructor(
    private readonly httpClient: HttpClientService,
    configService: ConfigService
  ) {
    this.apiConfig = new ApiConfig(configService);
  }

  async bigmodelGenerations(params: GenerationParams): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult, GenerationParams>(
      this.apiConfig.getConfig(ApiType.BIGMODEL),
      '/images/generations',
      'POST',
      params
    );
  }

  async siliconflowGenerations(params: GenerationParams): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult, GenerationParams>(
      this.apiConfig.getConfig(ApiType.SILICONFLOW),
      '/images/generations',
      'POST',
      params
    );
  }
}
