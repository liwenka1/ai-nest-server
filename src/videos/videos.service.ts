import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConfig, ApiType } from '../common/api.config';
import { HttpClientService } from '../common/http-client.service';
import { BigmodelVideoGenerationDTO, AsyncResultDTO } from './videos.dot';
import { GenerationResult, ApiEndpoint } from './videos.types';

@Injectable()
export class VideosService {
  private readonly apiConfig: ApiConfig;

  constructor(
    private readonly httpClient: HttpClientService,
    configService: ConfigService
  ) {
    this.apiConfig = new ApiConfig(configService);
  }

  async bigmodelGenerations(params: BigmodelVideoGenerationDTO): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult, { model: string }>(
      this.apiConfig.getConfig(ApiType.BIGMODEL),
      ApiEndpoint.GENERATIONS, // 使用枚举值
      'POST',
      {
        model: 'cogvideox-flash',
        ...params
        // 如果存在模型版本参数
        // ...(model_version && { model: `${cleanParams.model}-${model_version}` })
      }
    );
  }

  async bigmodelGenerationsResult(params: AsyncResultDTO): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult>(
      this.apiConfig.getConfig(ApiType.BIGMODEL),
      `${ApiEndpoint.ASYNC_RESULT}/${params.id}`,
      'GET'
    );
  }
}
