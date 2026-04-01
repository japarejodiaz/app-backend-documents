import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtVerifierPort } from '../../../Domain/auth/ports/jwt-verifier.port';

@Injectable()
export class JwtVerifierAdapter implements JwtVerifierPort {
  constructor(private readonly jwt: JwtService) {}

  verify<T extends object = any>(token: string): T {
    return this.jwt.verify<T>(token);
  }
}


