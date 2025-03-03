import { Controller, Post, Body } from '@nestjs/common';
import { ImagesService } from './images.service';
import { GenerationParams } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/bigmodel/generations')
  async bigmodelGenerateImage(@Body() params: GenerationParams) {
    return this.imagesService.bigmodelGenerations(params);
  }

  @Post('/siliconflow/generations')
  async siliconflowGenerateImage(@Body() params: GenerationParams) {
    return this.imagesService.siliconflowGenerations(params);
  }
}
