import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvValidationSchema } from './Application/config/env.validation';
import { EnvConfig } from './Application/config/envs.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades de base de datos
import { PersistenceModule } from './Infrastructure/persistence/persistence.module';
import { ControllersModule } from './Infrastructure/controllers/controllers.module';
import { AuthModule } from './Infrastructure/auth/auth.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig],
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        '.env',
      ],
      validationSchema: EnvValidationSchema,

    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get('db');

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.pass,
          database: db.name,
          autoLoadEntities: true,
          synchronize: config.get('environment') === 'develop',
          logging: true,
        };
      },
    }),
    PersistenceModule,
    ControllersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
