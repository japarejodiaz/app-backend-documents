import { Module } from '@nestjs/common';
import { PersistenceModule } from '../Infrastructure/persistence/persistence.module';
import { DocumentRepositoryAdapter } from '../Infrastructure/persistence/repositories/document.repository.adapters';
import { RunAnalysisUseCase } from '../Domain/analysis/run-analysis.usecase';
import { AnalysisRepositoryAdapter } from '../Infrastructure/persistence/repositories/analysis-repository.adapter';
import { UploadDocumentUseCase } from '../Domain/documents/upload-document-use.case';
import { TextExtractorPort } from '../Domain/documents/text-extractor.port';
import { AiAnalysisPort } from '../Domain/analysis/ai-analysis.port';
import { OpenAiAdapter } from '../Infrastructure/ai/openai.adapter';


@Module({
  imports: [PersistenceModule],
  providers: [
    // UploadDocumentUseCase
    {
      provide: UploadDocumentUseCase,
      useFactory: (
        documentRepo: DocumentRepositoryAdapter,
        textExtractor: TextExtractorPort,   // pendiente definir el tipo del text-extractor
      ) => new UploadDocumentUseCase(documentRepo, textExtractor),   // pendiente ingresar el text-extractor
      inject: [DocumentRepositoryAdapter],
    },

    // RunAnalysisUseCase
    {
      provide: RunAnalysisUseCase,
      useFactory: (
        ai: OpenAiAdapter,
        analysisRepo: AnalysisRepositoryAdapter,
      ) => new RunAnalysisUseCase(ai, analysisRepo),
      inject: [OpenAiAdapter, AnalysisRepositoryAdapter],
    }

  ],
  exports: [
    UploadDocumentUseCase,
    RunAnalysisUseCase,
  ],
})
export class ApplicationModule {}
