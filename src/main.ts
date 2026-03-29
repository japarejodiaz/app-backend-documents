import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  app.setGlobalPrefix(process.env.BASE_PATH ?? 'api');

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

  app.setGlobalPrefix('api');

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
  logger.log(`Application in url : ${await app.getUrl()}`);
}

void bootstrap();
