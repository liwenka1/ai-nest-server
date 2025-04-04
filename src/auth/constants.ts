import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = process.env.IS_PUBLIC_KEY;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const jwtConstants = {
  secret: process.env.JWT_SECRET
};
