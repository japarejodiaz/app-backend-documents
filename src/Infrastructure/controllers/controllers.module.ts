import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/module/documents.module';
import { AnalysisModule } from './analysis/module/analysis.module';
import { UsuariosModule } from './usuarios/module/usuarios.module';
import { AnalysisPortModule } from '../analysis/analysis.port.module';

@Module({
  imports: [
    UsuariosModule,
    DocumentsModule,
    AnalysisModule,
    AnalysisPortModule
  ],
})
export class ControllersModule {}


