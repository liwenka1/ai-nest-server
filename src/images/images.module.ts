import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from '../common/http-client.service';

@Module({
  imports: [HttpModule],
  controllers: [ImagesController],
  providers: [ImagesService, HttpClientService]
})
export class ImagesModule {}
