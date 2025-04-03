import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { SignInDto } from './sign-in.dto';
import { Request as ExpressRequest } from 'express';

// 定义明确的用户信息返回类型
interface UserProfile {
  sub: string;
  email: string;
  name: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req: ExpressRequest): UserProfile {
    return req.user as UserProfile;
  }
}
