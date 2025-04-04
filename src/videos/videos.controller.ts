import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VideosService } from './videos.service';
import { BigmodelVideoGenerationDTO, AsyncResultDTO } from './videos.dot';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('/bigmodel/generations')
  async bigmodelGenerations(@Body() params: BigmodelVideoGenerationDTO) {
    return this.videosService.bigmodelGenerations(params);
  }

  @Get('/async-result/:id')
  async getAsyncResult(@Param() params: AsyncResultDTO) {
    return this.videosService.bigmodelGenerationsResult(params);
  }
}
