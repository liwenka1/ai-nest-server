import { ConfigService } from '@nestjs/config';

export enum ApiType {
  BIGMODEL = 'BIGMODEL',
  SILICONFLOW = 'SILICONFLOW'
}

export class ApiConfig {
  constructor(private readonly configService: ConfigService) {}

  getConfig(apiType: ApiType): { baseUrl: string; apiKey: string } {
    return {
      baseUrl: this.configService.get(`${apiType}_API_BASE_URL`)!,
      apiKey: this.configService.get(`${apiType}_API_KEY`)!
    };
  }
}
