import { IsEmail, IsInt, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateUserWithVipDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Min(8)
  password: string;

  @IsInt()
  @Min(0)
  @Max(3) // 假设VIP等级为1-3
  vipLevel: number;

  @IsInt()
  @Min(1) // 最少1天有效期
  vipDurationDays: number;
}
