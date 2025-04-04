import { Controller, Post, Body } from '@nestjs/common';
import { ImagesService } from './images.service';
import { BigmodelGenerationDTO, SiliconflowGenerationDTO } from './images.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/bigmodel/generations')
  async bigmodelGenerateImage(@Body() params: BigmodelGenerationDTO) {
    return this.imagesService.bigmodelGenerations(params);
  }

  @Post('/siliconflow/generations')
  async siliconflowGenerateImage(@Body() params: SiliconflowGenerationDTO) {
    return this.imagesService.siliconflowGenerations(params);
  }
}
