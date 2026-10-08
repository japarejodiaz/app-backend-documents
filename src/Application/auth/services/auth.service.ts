import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ValidateUserUseCase } from '../use-cases/validate-user.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { JwtSignerPortToken } from '../../../Domain/auth/ports/jwt-signer.port';
import type { JwtSignerPort } from '../../../Domain/auth/ports/jwt-signer.port';
import { JwtVerifierPortToken } from '../../../Domain/auth/ports/jwt-verifier.port';
import type { JwtVerifierPort } from '../../../Domain/auth/ports/jwt-verifier.port';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    private readonly validateUser: ValidateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    @Inject(JwtSignerPortToken)
    private readonly jwtSigner: JwtSignerPort,

    @Inject(JwtVerifierPortToken)
    private readonly jwtVerifier: JwtVerifierPort,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser.execute(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    this.logger.debug("salida login", user);
    return this.loginUseCase.execute(user);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload;
    try {
      payload = this.jwtVerifier.verify(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Nuevo access token
    const newAccessToken = this.jwtSigner.sign(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      '15m'
    );

    // Nuevo refresh token (OBLIGATORIO)
    const newRefreshToken = this.jwtSigner.sign(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      '7d'
    );

    return {
      accessToken: newAccessToken,
      newRefreshToken
    };
  }

}