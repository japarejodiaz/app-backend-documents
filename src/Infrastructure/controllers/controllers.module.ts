import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios/usuarios.controller';
import { DocumentsController } from './documents/documents.controller';
import { AnalysisController } from './analysis/analysis.controller';
import { ApplicationModule } from '../../Application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [UsuariosController, DocumentsController, AnalysisController],
})
export class ControllersModule {}

