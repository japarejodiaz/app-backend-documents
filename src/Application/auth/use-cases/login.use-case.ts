import { Inject, Injectable } from '@nestjs/common';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { User } from '../../../Domain/users/user';
import type { JwtSignerPort } from '../../../Domain/auth/ports/jwt-signer.port';
import { JwtSignerPortToken } from '../../../Domain/auth/ports/jwt-signer.port';


@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(JwtSignerPortToken)
    private readonly jwtSigner: JwtSignerPort,
  ) {}

  async execute(user: User): Promise<TokenResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtSigner.sign(payload),
    };
  }
}
