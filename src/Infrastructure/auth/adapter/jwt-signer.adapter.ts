import { Injectable } from '@nestjs/common';
import { JwtSignerPort } from '../../../Domain/auth/ports/jwt-signer.port';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtSignerAdapter implements JwtSignerPort {
  constructor(private readonly jwt: JwtService) {}

  sign(payload: any): string {
    return this.jwt.sign(payload);
  }
}
