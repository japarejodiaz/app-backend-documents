import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { User } from './user';
import { UserRepositoryPortToken } from './user.repository.port';
import type { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(UserRepositoryPortToken)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }
}

