import { Module } from '@nestjs/common';
import { PersistenceModule } from '../Infrastructure/persistence/persistence.module';
import { UserRepositoryAdapter } from '../Infrastructure/persistence/repositories/user-repository.adapter';
import { DocumentRepositoryAdapter } from '../Infrastructure/persistence/repositories/document.repository.adapters';
import { AnalysisRepositoryAdapter } from '../Infrastructure/persistence/repositories/analysis-repository.adapter';
import { OpenAiAdapter } from '../Infrastructure/ai/openai.adapter';
import { CreateUserUseCase } from '../Domain/users/create-user.usecase';
import { GetUserByIdUseCase } from '../Domain/users/get-user-by-id.usecase';
import { UploadDocumentUseCase } from '../Domain/documents/upload-document-use.case';
import { RunAnalysisUseCase } from '../Domain/analysis/run-analysis.usecase';
import { GetAnalysisByDocumentUseCase } from '../Domain/analysis/get-analysis-by-document.usecase';
import { TextExtractorAdapter } from '../Infrastructure/persistence/repositories/text-extractor.adapter';


@Module({
  imports: [PersistenceModule],
  providers: [
    OpenAiAdapter,
    TextExtractorAdapter,
    {
      provide: 'UserRepositoryPort',
      useExisting: UserRepositoryAdapter,
    },
    {
      provide: 'DocumentRepositoryPort',
      useExisting: DocumentRepositoryAdapter,
    },
    {
      provide: 'AnalysisRepositoryPort',
      useExisting: AnalysisRepositoryAdapter,
    },
    {
      provide: 'AiAnalysisPort',
      useExisting: OpenAiAdapter,
    },
    {
      provide: 'TextExtractorPort',
      useExisting: TextExtractorAdapter,
    },
    CreateUserUseCase,
    GetUserByIdUseCase,
    UploadDocumentUseCase,
    RunAnalysisUseCase,
    GetAnalysisByDocumentUseCase,
  ],
  exports: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    UploadDocumentUseCase,
    RunAnalysisUseCase,
    GetAnalysisByDocumentUseCase,
  ],
})
export class ApplicationModule {}
