import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from '../common/http-client.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [VideosController],
  providers: [VideosService, UserService, PrismaService, HttpClientService]
})
export class VideosModule {}
