import { Module } from '@nestjs/common';

// Casos de uso
import { GetUserByIdUseCase } from '../../../../Domain/users/get-user-by-id.usecase';
import { UsuariosController } from '../usuarios.controller';
import { PersistenceModule } from '../../../persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [UsuariosController],
  providers: [
    GetUserByIdUseCase,
  ],
  exports: [
    GetUserByIdUseCase,
  ],
})

export class UsuariosModule {}
