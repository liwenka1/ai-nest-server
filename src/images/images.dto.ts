/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNumber, IsOptional, IsInt, Min, Max, IsBase64 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerationBaseDTO {
  @ApiProperty({
    example: 'A beautiful sunset over mountains',
    description: '文本提示词，用于描述生成内容'
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    example: 'blurry, low quality',
    description: '需要避免的内容描述',
    required: false
  })
  @IsOptional()
  @IsString()
  negative_prompt?: string;

  @ApiProperty({
    // enum: ['512x512', '768x768', '1024x1024'],
    example: '1024x1024',
    description: '生成图片尺寸'
  })
  // @IsIn(['512x512', '768x768', '1024x1024'])
  image_size: string;

  @ApiProperty({
    minimum: 1,
    maximum: 4,
    example: 1,
    description: '一次生成的图片数量'
  })
  @IsInt()
  @Min(1)
  @Max(4)
  batch_size: number;

  @ApiProperty({
    example: 42,
    description: '随机种子，用于保证生成一致性'
  })
  @IsNumber()
  seed: number;

  @ApiProperty({
    example: 50,
    description: '扩散模型推理步数',
    minimum: 10,
    maximum: 100
  })
  @IsInt()
  @Min(10)
  @Max(100)
  num_inference_steps: number;

  @ApiProperty({
    example: 7.5,
    description: '文本引导系数',
    minimum: 1,
    maximum: 20
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  guidance_scale: number;

  @ApiProperty({
    required: false,
    example: 'data:image/png;base64,iVBORw0KG...',
    description: '输入图片的Base64编码（用于图生图）'
  })
  @IsOptional()
  @IsBase64()
  image?: string;
}

// Bigmodel 专用 DTO（如果需要特殊参数）
export class BigmodelGenerationDTO extends GenerationBaseDTO {
  @ApiProperty({
    required: false,
    example: 'v2.1',
    description: 'Bigmodel专用模型版本'
  })
  @IsOptional()
  @IsString()
  model_version?: string;
}

// Siliconflow 专用 DTO（如果需要特殊参数）
export class SiliconflowGenerationDTO extends GenerationBaseDTO {
  @ApiProperty({
    required: false,
    example: 'high_detail',
    description: 'Siliconflow专用细节模式'
  })
  @IsOptional()
  @IsString()
  detail_mode?: string;
}
