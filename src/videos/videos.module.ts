import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from '../common/http-client.service';
import { UserModule } from '../user/user.module'; // 正确导入
import { PrismaModule } from '../prisma/prisma.module'; // 正确导入
import { UserService } from '../user/user.service';

@Module({
  imports: [HttpModule, UserModule, PrismaModule], // 通过 imports 注入依赖
  controllers: [VideosController],
  providers: [VideosService, HttpClientService, UserService]
})
export class VideosModule {}
