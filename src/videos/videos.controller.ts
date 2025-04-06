import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { VideosService } from './videos.service';
import { BigmodelVideoGenerationDTO, AsyncResultDTO } from './videos.dot';
import { JwtPayload } from '../auth/auth.typs';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('bigmodel/generations')
  async bigmodelGenerations(@Body() params: BigmodelVideoGenerationDTO, @Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayload).sub;

    return this.videosService.bigmodelGenerations(userId, params);
  }

  @Get('async-result/:id')
  async getAsyncResult(@Param() params: AsyncResultDTO, @Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayload).sub;

    return this.videosService.bigmodelGenerationsResult(userId, params);
  }
}
