import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './filter/transform-interceptor';
import { GlobalExceptionFilter } from './filter/http-exception.filter';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册全局拦截器（处理成功响应）
  app.useGlobalInterceptors(new TransformInterceptor());

  // 注册全局过滤器（处理错误响应）
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors();

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤未定义的属性
      forbidNonWhitelisted: true, // 抛出错误如果有未定义的属性
      transform: true // 自动类型转换
    })
  );

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
