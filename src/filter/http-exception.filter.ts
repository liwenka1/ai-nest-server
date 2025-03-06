import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

type ExceptionResponse = string | { message?: string | string[]; error?: string };

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 初始化安全默认值
    const errorResponse = {
      success: false,
      message: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString()
    };

    // 类型安全的异常处理
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ExceptionResponse;

      errorResponse.statusCode = status;
      errorResponse.message = this.extractMessage(exceptionResponse);
    } else if (exception instanceof Error) {
      errorResponse.message = exception.message;
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  // 安全的消息提取方法
  private extractMessage(response: ExceptionResponse): string {
    if (typeof response === 'string') {
      return response;
    }

    if (Array.isArray(response.message)) {
      return response.message.join(', ');
    }

    return response.message || 'Unknown error';
  }
}
