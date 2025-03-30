import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

type UserWithVip = Prisma.UserGetPayload<{
  include: {
    vip: true;
  };
}>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where
    });
  }

  // 获取用户VIP状态
  async getVipStatus(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { vip: true }
    });

    if (!user?.vip) return { isVip: false };

    const isActive = user.vip.expiresAt > new Date();
    return {
      isVip: isActive,
      level: isActive ? user.vip.level : 0,
      expiresAt: user.vip.expiresAt
    };
  }

  // 设置/更新VIP
  async updateVip(userId: number, level: number, durationDays: number) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    await this.prisma.userVip.upsert({
      where: { userId },
      update: { level, expiresAt },
      create: {
        userId,
        level,
        expiresAt
      }
    });
  }

  async createUserWithVip(
    userData: Prisma.UserCreateInput,
    vipData: {
      level: number;
      durationDays: number;
    }
  ): Promise<UserWithVip> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + vipData.durationDays);

    return this.prisma.user.create({
      data: {
        ...userData,
        vip: {
          create: {
            level: vipData.level,
            expiresAt: expiresAt
          }
        }
      },
      include: {
        vip: true
      }
    });
  }
}
