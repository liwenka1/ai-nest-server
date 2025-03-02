import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './images/images.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // 加载.env文件
    HttpModule, // 注入HttpServiceImagesModule
    ImagesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
