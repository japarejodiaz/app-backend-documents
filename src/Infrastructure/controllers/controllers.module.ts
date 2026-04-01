import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios/usuarios.controller';
import { DocumentsController } from './documents/documents.controller';
import { AnalysisController } from './analysis/analysis.controller';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [
    PersistenceModule, // ← NECESARIO para GetUserByIdUseCase
  ],
  controllers: [UsuariosController, DocumentsController, AnalysisController],
})
export class ControllersModule {}

