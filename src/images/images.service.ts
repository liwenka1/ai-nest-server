import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerationResult } from './images.types';
import { ApiConfig, ApiType } from '../common/api.config';
import { HttpClientService } from '../common/http-client.service';
import { BigmodelGenerationDTO, SiliconflowGenerationDTO } from './images.dto';

@Injectable()
export class ImagesService {
  private readonly apiConfig: ApiConfig;

  constructor(
    private readonly httpClient: HttpClientService,
    configService: ConfigService
  ) {
    this.apiConfig = new ApiConfig(configService);
  }

  async bigmodelGenerations(params: BigmodelGenerationDTO): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult, BigmodelGenerationDTO & { model: string }>(
      this.apiConfig.getConfig(ApiType.BIGMODEL),
      '/images/generations',
      'POST',
      {
        // 保持原有默认参数逻辑
        model: 'cogview-3-flash',
        // 使用 DTO 展开参数
        ...params
        // 覆盖 DTO 中的 model 字段（如果需要）
        // model: params.model_version ? `${params.model}-${params.model_version}` : 'cogview-3-flash'
      }
    );
  }

  async siliconflowGenerations(params: SiliconflowGenerationDTO): Promise<GenerationResult> {
    return this.httpClient.request<GenerationResult, SiliconflowGenerationDTO & { model: string }>(
      this.apiConfig.getConfig(ApiType.SILICONFLOW),
      '/images/generations',
      'POST',
      {
        model: 'Kwai-Kolors/Kolors',
        ...params
        // 处理特殊参数示例
        // ...(params.detail_mode && { detail: params.detail_mode })
      }
    );
  }
}
