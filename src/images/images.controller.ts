import { Controller, Post, Body, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ImagesService } from './images.service';
import { BigmodelGenerationDTO, SiliconflowGenerationDTO } from './images.dto';
import { JwtPayload } from '../auth/auth.typs';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('bigmodel/generations')
  async bigmodelGenerateImage(@Body() params: BigmodelGenerationDTO, @Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayload).sub;

    return this.imagesService.bigmodelGenerations(userId, params);
  }

  @Post('siliconflow/generations')
  async siliconflowGenerateImage(@Body() params: SiliconflowGenerationDTO, @Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayload).sub;

    return this.imagesService.siliconflowGenerations(userId, params);
  }
}
