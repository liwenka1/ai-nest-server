import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from 'src/common/http-client.service';

@Module({
  imports: [HttpModule],
  controllers: [VideosController],
  providers: [VideosService, HttpClientService]
})
export class VideosModule {}
