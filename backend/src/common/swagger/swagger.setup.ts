import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER } from './swagger.constants';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nidhara API')
    .setDescription('Backend API documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      SWAGGER.AUTH_SCHEMES.ACCESS_TOKEN,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ This avoids swagger-ui assets resolving to /docs/docs/*
  SwaggerModule.setup(SWAGGER.DOCS_PATH, app, document, {
    useGlobalPrefix: false,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
