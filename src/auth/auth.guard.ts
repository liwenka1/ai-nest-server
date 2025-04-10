import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY, jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './auth.typs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('缺少访问令牌');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret: jwtConstants.secret });

      // 类型安全赋值
      request.user = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        vipLevel: payload.vipLevel,
        vipExpiresAt: payload.vipExpiresAt
      };
    } catch (error) {
      throw new UnauthorizedException(this.getErrorMessage(error));
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  // 错误信息细化处理
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.name === 'TokenExpiredError' ? '访问令牌已过期' : '无效的访问令牌';
    }
    return '未知的认证错误';
  }
}
