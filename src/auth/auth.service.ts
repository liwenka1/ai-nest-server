import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findUser({ email });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user?.id,
      name: user?.name,
      email: user?.email,
      vipLevel: user?.vipLevel,
      vipExpiresAt: user?.vipExpiresAt
    };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
