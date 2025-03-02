import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ProxyMiddleware } from '../middleware/proxy.middleware';
import { RequestMethod } from '@nestjs/common'; // 新增导入
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ImagesController],
  providers: [ImagesService]
})
export class ImagesModule {
  // // 实现 NestModule 接口
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(ProxyMiddleware).forRoutes(
  //     { path: '*', method: RequestMethod.POST } // 精确匹配所有 POST 请求
  //   );
  // }
}
