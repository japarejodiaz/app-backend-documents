import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from './user';
import type { UserRepositoryPort } from './user.repository.port';
import { UsuariosController } from '../../Infrastructure/controllers/usuarios/usuarios.controller';

export interface CreateUserDto {
  name: string;
  email: string;
}

@Injectable()
export class CreateUserUseCase {

  private readonly logger = new Logger('CreateUserUseCase');
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = new User(
      uuidv4(),
      dto.name,
      dto.email,
      'user',
      new Date(),
    );
    this.logger.log(user);
    return this.userRepo.save(user);
  }
}
