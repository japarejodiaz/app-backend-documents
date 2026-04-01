import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from '../../../Domain/users/user.repository.port';
import { UserRepositoryPortToken } from '../../../Domain/users/user.repository.port';
import { PasswordHasherPortToken } from '../../../Domain/auth/ports/password-hasher.port';
import type { PasswordHasherPort } from '../../../Domain/auth/ports/password-hasher.port';


@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(UserRepositoryPortToken)
    private readonly usersRepo: UserRepositoryPort,

    @Inject(PasswordHasherPortToken)
    private readonly hasher: PasswordHasherPort,

  ) {}

  async execute(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) return null;

    const isValid = await this.hasher.compare(password, user.password);
    return isValid ? user : null;

  }
}
