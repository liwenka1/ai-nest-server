import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { ImagesService } from './images.service';
import { GenerationParams } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('generations')
  async generateImage(@Body() params: GenerationParams) {
    const result = await this.imagesService.generations({
      ...params
    });

    if (result.status >= 400) {
      throw new HttpException(result.data, result.status);
    }

    return result.data;
  }
}
