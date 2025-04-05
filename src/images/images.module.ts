import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from '../common/http-client.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [ImagesController],
  providers: [ImagesService, UserService, PrismaService, HttpClientService]
})
export class ImagesModule {}
