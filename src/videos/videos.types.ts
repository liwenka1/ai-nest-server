import { Method } from 'axios';

export interface GenerationResult {
  created: number;
  data: Array<{
    url: string;
    duration?: number; // 视频新增字段
    thumbnail?: string;
  }>;
}

export enum ApiEndpoint {
  GENERATIONS = '/videos/generations',
  ASYNC_RESULT = '/async-result'
}

export interface RequestConfig<T = unknown> {
  method: Method;
  url: string;
  data?: T;
  params?: Record<string, any>;
}
