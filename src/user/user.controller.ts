import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { Public } from '../auth/constants';
import { CreateUserDto, UpdateVipDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUserWithVip(
      {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password // 确保服务层已处理密码加密
      },
      createUserDto.vip
    );
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findUser({ id: Number(id) });
  }

  @Get()
  listUsers(
    @Body()
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    }
  ) {
    return this.userService.findUsers(params);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id: Number(id) });
  }

  @Get(':id/vip-status')
  async getVipStatus(@Param('id') id: string) {
    return this.userService.getVipStatus(Number(id));
  }

  @Put(':id/vip')
  async updateVipStatus(@Param('id') id: string, @Body() updateVipDto: UpdateVipDto) {
    return this.userService.updateVip(Number(id), updateVipDto.level, updateVipDto.durationDays);
  }

  @Get(':id/usage')
  async getUsage(@Param('id') id: string) {
    return this.userService.getDailyUsage(Number(id));
  }
}
