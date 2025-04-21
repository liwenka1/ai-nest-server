import { IsString, IsNumber, IsOptional, IsIn, IsInt, Min, Max, IsBase64, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoGenerationBaseDTO {
  @ApiProperty({
    example: 'A dancing robot in cyberpunk city',
    description: '视频生成提示词'
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    example: 'https://aigc-files.bigmodel.cn/api/cogview/2025030623435751a6227acd6f4084_0.png',
    description: '视频生成图片'
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({
    example: true,
    description: '是否有声音'
  })
  @IsOptional()
  @IsBoolean()
  with_audio?: boolean;

  @ApiProperty({
    example: 'low quality, blurry',
    description: '需要避免的内容描述',
    required: false
  })
  @IsOptional()
  @IsString()
  negative_prompt?: string;

  @ApiProperty({
    enum: ['512x512', '768x432', '1024x576'],
    example: '768x432',
    description: '视频分辨率'
  })
  @IsOptional()
  @IsIn(['512x512', '768x432', '1024x576'])
  image_size?: string;

  @ApiProperty({
    minimum: 1,
    maximum: 2,
    example: 1,
    description: '生成视频数量'
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2)
  batch_size?: number;

  @ApiProperty({
    example: 42,
    description: '随机种子'
  })
  @IsOptional()
  @IsNumber()
  seed?: number;

  @ApiProperty({
    example: 24,
    description: '视频总帧数',
    minimum: 12,
    maximum: 60
  })
  @IsOptional()
  @IsInt()
  @Min(12)
  @Max(60)
  num_inference_steps?: number;

  @ApiProperty({
    example: 7.5,
    description: '引导系数',
    minimum: 1,
    maximum: 20
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  guidance_scale?: number;

  @ApiProperty({
    required: false,
    example: 'data:image/png;base64,iVBORw0KG...',
    description: '输入图片的Base64编码'
  })
  @IsOptional()
  @IsBase64()
  image?: string;
}

// Bigmodel 视频专用 DTO
export class BigmodelVideoGenerationDTO extends VideoGenerationBaseDTO {
  //   @ApiProperty({
  //     example: 'video-model-v2',
  //     description: '大模型专用视频模型版本'
  //   })
  //   @IsString()
  //   model: string;
}

// 异步结果查询 DTO
export class AsyncResultDTO {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: '异步任务ID'
  })
  @IsString()
  id: string;
}
