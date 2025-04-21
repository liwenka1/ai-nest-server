import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, DailyUsage, Prisma } from '@prisma/client';

const USAGE_LIMITS = {
  free: { image: 10, video: 2 },
  vip1: { image: 1000, video: 10 },
  vip2: { image: 3000, video: 20 }
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 基础 CRUD 操作
  async findUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  async findUsers(params: {
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
    return this.prisma.user.create({ data });
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    return this.prisma.user.update(params);
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }

  // VIP 相关操作
  async getVipStatus(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { vipLevel: true, vipExpiresAt: true }
    });

    const isActive = user?.vipExpiresAt && user.vipExpiresAt > new Date();
    return {
      isVip: !!isActive,
      level: isActive ? user.vipLevel : 0,
      expiresAt: user?.vipExpiresAt
    };
  }

  async updateVip(userId: number, level: number, durationDays: number) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        vipLevel: level,
        vipExpiresAt: expiresAt
      }
    });
  }

  // 使用量相关操作
  async getDailyUsage(userId: number): Promise<DailyUsage> {
    const today = new Date().toISOString().split('T')[0];
    return this.prisma.dailyUsage.upsert({
      where: { userId_date: { userId, date: today } },
      update: {},
      create: {
        userId,
        date: today,
        imageCount: 0,
        videoCount: 0
      }
    });
  }

  async checkUsage(userId: number, type: 'image' | 'video') {
    const today = new Date().toISOString().split('T')[0];
    const field = `${type}Count`;

    // 原子操作更新用量
    const usage = await this.prisma.dailyUsage.upsert({
      where: { userId_date: { userId, date: today } },
      update: { [field]: { increment: 1 } },
      create: { userId, date: today, [field]: 1 }
    });

    // 获取用户权限
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { vipLevel: true, vipExpiresAt: true }
    });

    // 判断有效VIP
    const isVipActive = user?.vipExpiresAt && user.vipExpiresAt > new Date();
    const vipLevel = isVipActive ? user.vipLevel : 0;

    // 确定限额
    const limitKey = vipLevel >= 2 ? 'vip2' : vipLevel === 1 ? 'vip1' : 'free';
    const limit = USAGE_LIMITS[limitKey];

    // 检查是否超限
    if (usage[field] > limit[type]) {
      throw new HttpException(`${type} limit exceeded`, 429);
    }
  }

  // 创建用户时初始化 VIP
  async createUserWithVip(data: Prisma.UserCreateInput, vip?: { level: number; durationDays: number }): Promise<User> {
    const userData = vip
      ? {
          ...data,
          vipLevel: vip.level,
          vipExpiresAt: new Date(Date.now() + vip.durationDays * 86400000)
        }
      : data;

    return this.prisma.user.create({
      data: userData
    });
  }
}
