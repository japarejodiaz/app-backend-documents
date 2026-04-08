import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../../persistence/persistence.module';

import { AnalysisController } from '../analysis.controller';

// Casos de uso
import { RunAnalysisUseCase } from '../../../../Domain/analysis/run-analysis.usecase';
import { GetAnalysisByDocumentUseCase } from '../../../../Domain/analysis/get-analysis-by-document.usecase';



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
