import { Injectable } from '@nestjs/common';
import { JwtSignerPort } from '../../../Domain/auth/ports/jwt-signer.port';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtSignerAdapter implements JwtSignerPort {
  constructor(private readonly jwt: JwtService) {}

  sign(payload: Record<string, any>, expiresIn = '15m'): string {
    return (this.jwt as any).sign(payload, { expiresIn } as any);
  }
}

