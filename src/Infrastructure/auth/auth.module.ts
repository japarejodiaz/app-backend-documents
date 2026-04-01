import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';

import { AuthService } from '../../Application/auth/services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from '../../Application/auth/strategies/jwt.strategy';

// Tokens
import { JwtSignerPortToken } from '../../Domain/auth/ports/jwt-signer.port';
import { JwtVerifierPortToken } from '../../Domain/auth/ports/jwt-verifier.port';
import { PasswordHasherPortToken } from '../../Domain/auth/ports/password-hasher.port';

// Adaptadores

import { JwtSignerAdapter } from './adapter/jwt-signer.adapter';
import { JwtVerifierAdapter } from './adapter/jwt-verifier.adapter';
import { PasswordHasherAdapter } from './adapter/password-hasher.adapter';
import { ValidateUserUseCase } from '../../Application/auth/use-cases/validate-user.use-case';
import { LoginUseCase } from '../../Application/auth/use-cases/login.use-case';
import { CreateUserUseCase } from '../../Domain/users/create-user.usecase';


@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    PersistenceModule,
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,

    // Casos de uso
    ValidateUserUseCase,
    LoginUseCase,
    CreateUserUseCase,

    // Adaptadores (implementaciones de puertos)
    { provide: JwtSignerPortToken, useClass: JwtSignerAdapter },
    { provide: JwtVerifierPortToken, useClass: JwtVerifierAdapter },
    {
      provide: PasswordHasherPortToken,
      useClass: PasswordHasherAdapter,
    },

  ],

  exports: [AuthService],
})
export class AuthModule {}
