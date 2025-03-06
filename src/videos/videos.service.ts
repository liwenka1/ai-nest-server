import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiEndpoint, BigmodelGenerationsParams, GenerationParams, GenerationResult } from './types';
import { ApiConfig, ApiType } from 'src/common/api.config';
import { HttpClientService } from 'src/common/http-client.service';

@Injectable()
export class VideosService {
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
      '/videos/generations',
      'POST',
      { model: 'cogvideox-flash', ...params }
    );
  }

  async bigmodelGenerationsResult(id: string): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult>(
      this.apiConfig.getConfig(ApiType.BIGMODEL),
      `${ApiEndpoint.ASYNC_RESULT}/${id}`,
      'GET'
    );
  }
}
