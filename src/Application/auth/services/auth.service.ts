import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserUseCase } from '../use-cases/validate-user.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly validateUser: ValidateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  async login(email: string, password: string) {
    const user = await this.validateUser.execute(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.loginUseCase.execute(user);
  }
}