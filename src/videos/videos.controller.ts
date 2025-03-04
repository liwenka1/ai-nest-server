import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenerationParams } from './types';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('/bigmodel/generations')
  async bigmodelGenerations(@Body() params: GenerationParams) {
    return this.videosService.bigmodelGenerations(params);
  }

  @Get('/async-result/:id')
  async getAsyncResult(@Param('id') id: string) {
    return this.videosService.bigmodelGenerationsResult(id);
  }
}
