import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const baseUrl = this.configService.get('API_BASE_URL') as string;

    // 只处理POST请求
    if (req.method !== 'POST') return next();

    try {
      const response = await this.httpService.axiosRef({
        method: 'POST',
        url: `${baseUrl}${req.originalUrl}`,
        data: req.body,
        headers: {
          ...req.headers,
          host: new URL(baseUrl).hostname // 修正host头
        }
      });

      res.status(response.status).send(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).send(
        error.response?.data || {
          message: 'Proxy error'
        }
      );
    }
  }
}
