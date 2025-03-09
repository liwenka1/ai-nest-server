import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigmodelGenerationsParams, GenerationParams, GenerationResult } from './types';
import { ApiConfig, ApiType } from '../common/api.config';
import { HttpClientService } from '../common/http-client.service';

@Injectable()
export class ImagesService {
  private readonly apiConfig: ApiConfig;

  constructor(
    private readonly httpClient: HttpClientService,
    configService: ConfigService
  ) {
    this.apiConfig = new ApiConfig(configService);
  }

  async bigmodelGenerations(params: BigmodelGenerationsParams): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult, GenerationParams>(
      this.apiConfig.getConfig(ApiType.BIGMODEL),
      '/images/generations',
      'POST',
      { model: 'cogview-3-flash', ...params }
    );
  }

  async siliconflowGenerations(params: BigmodelGenerationsParams): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult, GenerationParams>(
      this.apiConfig.getConfig(ApiType.SILICONFLOW),
      '/images/generations',
      'POST',
      { model: 'Kwai-Kolors/Kolors', ...params }
    );
  }
}
