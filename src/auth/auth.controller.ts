import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { SignInDto } from './sign-in.dto';
import { Request as ExpressRequest } from 'express';
import { JwtPayload } from './auth.typs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req: ExpressRequest): JwtPayload {
    return req.user as JwtPayload;
  }
}
