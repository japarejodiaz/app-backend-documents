import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EnvValidationSchema } from './Application/config/env.validation';
import { EnvConfig } from './Application/config/envs.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos funcionales
import { PersistenceModule } from './Infrastructure/persistence/persistence.module';
import { AuthModule } from './Infrastructure/auth/auth.module';
import { DocumentsModule } from './Infrastructure/controllers/documents/module/documents.module';
import { UsuariosModule } from './Infrastructure/controllers/usuarios/module/usuarios.module';
import { AnalysisModule } from './Infrastructure/controllers/analysis/module/analysis.module';



@Module({
  imports: [
    // Config global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig],
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        '.env',
      ],
      validationSchema: EnvValidationSchema,
    }),

    // TypeORM
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

    // Infraestructura
    PersistenceModule,

    // Módulos funcionales
    AuthModule,
    UsuariosModule,
    DocumentsModule,
    AnalysisModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

