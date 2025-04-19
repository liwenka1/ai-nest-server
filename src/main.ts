import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './filter/transform-interceptor';
import { GlobalExceptionFilter } from './filter/http-exception.filter';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // 导入 NestExpressApplication

// 创建一个缓存变量来存储应用实例
let cachedApp: NestExpressApplication;

async function bootstrap() {
  // 如果已有缓存实例，直接返回
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule); // 指定类型
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

  await app.init(); // 初始化应用，但不监听端口
  cachedApp = app; // 缓存实例
  return app;
}

// 导出一个 Vercel 可以使用的 handler
export default async (req, res) => {
  const app = await bootstrap();
  // 确保使用 Express 适配器
  const httpAdapter = app.getHttpAdapter();
  // 检查 httpAdapter 是否有 getInstance 方法 (Express 适配器有)
  if (httpAdapter && typeof httpAdapter.getInstance === 'function') {
    const server = httpAdapter.getInstance();
    server(req, res); // 将请求传递给 NestJS 应用处理
  } else {
    console.error('HTTP adapter does not have getInstance method.');
    res.statusCode = 500;
    res.end('Internal Server Error: Invalid HTTP adapter.');
  }
};

// // 移除或注释掉原来的启动代码
// bootstrap()
//   .then(() => {
//     console.log(`🚀 Server ready at http://localhost:${process.env.PORT ?? 5000}`);
//     console.log(`✨ Environment: ${process.env.NODE_ENV || 'development'}`);
//   })
//   .catch((err) => {
//     console.error('💥 Bootstrap failed:', err);
//     process.exit(1);
//   });
