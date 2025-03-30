import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { Public } from '../auth/constants';
import { CreateUserWithVipDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/search')
  search(
    @Body()
    params: Prisma.UserWhereUniqueInput
  ) {
    return this.userService.user(params);
  }

  @Post('/searchAll')
  searchAll(
    @Body()
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    }
  ) {
    return this.userService.users(params);
  }

  @Public()
  @Post('create-with-vip')
  async createUserWithVip(@Body() createDto: CreateUserWithVipDto) {
    // 解构DTO参数
    const { email, name, password, vipLevel, vipDurationDays } = createDto;

    // 调用服务层方法
    return this.userService.createUserWithVip(
      {
        email,
        name,
        password // 注意：服务层应该处理密码加密
      },
      {
        level: vipLevel,
        durationDays: vipDurationDays
      }
    );
  }
}
