import { ConfigService } from '@nestjs/config';

export enum ApiType {
  BIGMODEL = 'BIGMODEL',
  SILICONFLOW = 'SILICONFLOW'
}

export class ApiConfig {
  constructor(private readonly configService: ConfigService) {}

  getConfig(apiType: ApiType): { baseUrl: string; apiKey: string } {
    const baseUrl = this.configService.get<string>(`${apiType}_API_BASE_URL`);
    const apiKey = this.configService.get<string>(`${apiType}_API_KEY`);

    if (!baseUrl || !apiKey) {
      throw new Error(`Configuration for ${apiType} API is missing`);
    }

    return { baseUrl, apiKey };
  }
}
