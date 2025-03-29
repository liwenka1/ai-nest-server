import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/creat')
  creat(@Body() params: Prisma.UserCreateInput) {
    return this.userService.createUser(params);
  }
}
