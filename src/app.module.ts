import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosController } from './Infrastructure/controllers/usuarios/usuarios.controller';
import { EnvValidationSchema } from './Application/config/env.validation';
import { EnvConfig } from './Application/config/envs.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades de base de datos
import { PersistenceModule } from './Infrastructure/persistence/persistence.module';
import { ApplicationModule } from './Application/application.module';



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
          logging: true, // 👈 AGREGA ESTO
        };
      },
    }),
    PersistenceModule,    // Registra las entidades
    ApplicationModule
  ],
  controllers: [AppController, UsuariosController],
  providers: [AppService],
})
export class AppModule {
}
