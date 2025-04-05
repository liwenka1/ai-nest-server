import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerationResult } from './images.types';
import { ApiConfig, ApiType } from '../common/api.config';
import { HttpClientService } from '../common/http-client.service';
import { BigmodelGenerationDTO, SiliconflowGenerationDTO } from './images.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ImagesService {
  private readonly apiConfig: ApiConfig;

  constructor(
    private readonly httpClient: HttpClientService,
    private readonly userService: UserService,
    configService: ConfigService
  ) {
    this.apiConfig = new ApiConfig(configService);
  }

  async bigmodelGenerations(userId: number, params: BigmodelGenerationDTO): Promise<GenerationResult> {
    await this.userService.checkUsage(userId, 'image');

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

  async siliconflowGenerations(userId: number, params: SiliconflowGenerationDTO): Promise<GenerationResult> {
    await this.userService.checkUsage(userId, 'image');

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
