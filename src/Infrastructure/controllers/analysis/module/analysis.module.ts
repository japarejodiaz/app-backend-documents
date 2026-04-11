import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../../persistence/persistence.module';

import { AnalysisController } from '../analysis.controller';

// Casos de uso
import { RunAnalysisUseCase } from '../../../../Application/analysis/use-cases/run-analysis.usecase';
import { GetAnalysisByDocumentUseCase } from '../../../../Application/analysis/use-cases/get-analysis-by-document.usecase';



@Module({
  imports: [PersistenceModule],
  controllers: [AnalysisController],
  providers: [
    RunAnalysisUseCase,
    GetAnalysisByDocumentUseCase,
  ],
  exports: [
    RunAnalysisUseCase,
    GetAnalysisByDocumentUseCase,
  ],
})

export class AnalysisModule {}
