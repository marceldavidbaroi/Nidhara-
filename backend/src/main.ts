import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { setupSwagger } from '@/common/swagger/swagger.setup';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // pino logger
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // cookies
  app.use(cookieParser());

  // Central Swagger setup
  setupSwagger(app);
  
app.enableCors({
  origin: [
    'http://localhost:3000', // frontend dev
  ],
  credentials: true, // REQUIRED for cookies
});

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
