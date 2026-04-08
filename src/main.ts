import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  const configBaseP = app.get(ConfigService);
  const basePath = configBaseP.get<string>('basePath') ?? 'api';

  app.setGlobalPrefix(basePath);


  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Documents Analyzer API')
    .setDescription('API para análisis de documentos')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT-auth', // ← nombre del esquema
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/app-documents-ia/docs', app, document);

  // Verificar conexión a BD
  const dataSource = app.get(DataSource);
  try {
    await dataSource.query('SELECT 1');
    console.log('✔️ Conexión a PostgreSQL OK');
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err);
    process.exit(1); // Detener la app
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  logger.log(`Application is running on port : ${port} || Enviroment: ${process.env.NODE_ENV}`);
  logger.log(`Application in url : ${await app.getUrl()}/api/app-documents-ia/docs`);
}

void bootstrap();
