import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

// 显式导出 VipDto
export class VipDto {
  @IsInt({ message: 'VIP等级必须是数字' })
  level!: number; // 明确非空断言

  @IsInt({ message: '有效期天数必须是数字' })
  durationDays!: number;
}

export class CreateUserDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  email!: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  name!: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => VipDto)
  vip?: VipDto;
}

export class UpdateVipDto {
  @IsInt({ message: 'VIP等级必须是数字' })
  level!: number;

  @IsInt({ message: '有效期天数必须是数字' })
  durationDays!: number;
}
