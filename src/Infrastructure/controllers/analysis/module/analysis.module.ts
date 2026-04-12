import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../../persistence/persistence.module';

import { AnalysisController } from '../analysis.controller';

// Casos de uso
import { RunAnalysisUseCase } from '../../../../Application/analysis/use-cases/run-analysis.usecase';
import { GetAnalysisByDocumentUseCase } from '../../../../Application/analysis/use-cases/get-analysis-by-document.usecase';
import { GetAnalysisByIdUseCase } from '../../../../Application/analysis/use-cases/get-analysis-by-id.usecase';
import { GetAnalysisByUserUseCase } from '../../../../Application/analysis/use-cases/get-analysis-by-user.usecase';
import { GetAllAnalysisUseCase } from '../../../../Application/analysis/use-cases/get-all-analysis.usecase';
import { DeleteAnalysisUseCase } from '../../../../Application/analysis/use-cases/delete-analysis.usecase';
import { AnalysisPortModule } from '../../../analysis/analysis.port.module';


@Module({
  imports: [
    AnalysisPortModule,   // IA, reglas, consolidación
    PersistenceModule,    // repositorios (analysisRepo, documentsRepo, etc.)
  ],
  controllers: [AnalysisController],
  providers: [
    RunAnalysisUseCase,
    GetAnalysisByDocumentUseCase,
    GetAnalysisByIdUseCase,
    GetAnalysisByUserUseCase,
    GetAllAnalysisUseCase,
    DeleteAnalysisUseCase,
  ],
  exports: [
    RunAnalysisUseCase,
    GetAnalysisByDocumentUseCase,
    GetAnalysisByIdUseCase,
    GetAnalysisByUserUseCase,
    GetAllAnalysisUseCase,
    DeleteAnalysisUseCase,
  ]
})
export class AnalysisModule {}

