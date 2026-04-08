import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/module/documents.module';
import { AnalysisModule } from './analysis/module/analysis.module';
import { UsuariosModule } from './usuarios/module/usuarios.module';

@Module({
  imports: [
    UsuariosModule,
    DocumentsModule,
    AnalysisModule,
  ],
})
export class ControllersModule {}


