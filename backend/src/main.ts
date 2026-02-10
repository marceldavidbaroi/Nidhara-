import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { setupSwagger } from '@/common/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // pino logger
  app.useLogger(app.get(Logger));

  // cookies
  app.use(cookieParser());

  // Central Swagger setup
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
