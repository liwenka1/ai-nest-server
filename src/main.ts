import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './filter/transform-interceptor';
import { GlobalExceptionFilter } from './filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册全局拦截器（处理成功响应）
  app.useGlobalInterceptors(new TransformInterceptor());

  // 注册全局过滤器（处理错误响应）
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap()
  .then(() => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT ?? 5000}`);
    console.log(`✨ Environment: ${process.env.NODE_ENV || 'development'}`);
  })
  .catch((err) => {
    console.error('💥 Bootstrap failed:', err);
    process.exit(1);
  });
