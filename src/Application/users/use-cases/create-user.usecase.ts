import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../../Domain/users/user';
import type { UserRepositoryPort } from '../../../Domain/users/user.repository.port';
import { UserRepositoryPortToken } from '../../../Domain/users/user.repository.port';
import { PasswordHasherPortToken } from '../../../Domain/auth/ports/password-hasher.port';
import type { PasswordHasherPort } from '../../../Domain/auth/ports/password-hasher.port';


export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {

  private readonly logger = new Logger('CreateUserUseCase');
  constructor(
    @Inject(UserRepositoryPortToken)
    private readonly userRepo: UserRepositoryPort,

    @Inject(PasswordHasherPortToken)
    private readonly hasher: PasswordHasherPort,

  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hasher.hash(dto.password);

    const user = new User(
      uuidv4(),
      dto.name,
      dto.email,
      'user',
      new Date(),
      hashedPassword,
    );
    this.logger.log(user);
    return this.userRepo.save(user);
  }
}
