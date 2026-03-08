import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosController } from './Infrastructure/controllers/usuarios/usuarios.controller';
import { EnvValidationSchema } from './Application/config/env.validation';
import { EnvConfig } from './Application/config/envs.config';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    load: [ EnvConfig ],
    envFilePath: [
      `.env.${process.env.NODE_ENV}`,
      '.env',
    ],
    validationSchema: EnvValidationSchema,
  }),
  ],
  controllers: [AppController, UsuariosController],
  providers: [AppService],
})
export class AppModule {}
