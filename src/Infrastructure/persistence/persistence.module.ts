import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { DocumentEntity } from './entities/document.entity';
import { AnalysisEntity } from './entities/analysis.entity';

// Adaptadores
import { UserRepositoryAdapter } from './repositories/user-repository.adapter';
import { DocumentRepositoryAdapter } from './repositories/document.repository.adapters';
import { AnalysisRepositoryAdapter } from './repositories/analysis-repository.adapter';
import { TextExtractorAdapter } from './repositories/text-extractor.adapter';
import { OpenAiAdapter } from '../ai/openai.adapter';

// casos de uso
import { GetUserByIdUseCase } from '../../Domain/users/get-user-by-id.usecase';
import { UploadDocumentUseCase } from '../../Domain/documents/upload-document-use.case';
import { RunAnalysisUseCase } from '../../Domain/analysis/run-analysis.usecase';
import { GetAnalysisByDocumentUseCase } from '../../Domain/analysis/get-analysis-by-document.usecase';

// Tokens
import { UserRepositoryPortToken } from '../../Domain/users/user.repository.port';
import { DocumentRepositoryPortToken } from '../../Domain/documents/document.repository.port';
import { AnalysisRepositoryPortToken } from '../../Domain/analysis/analysis.repository.port';
import { TextExtractorPortToken } from '../../Domain/documents/text-extractor.port';
import { AiAnalysisPortToken } from '../../Domain/analysis/ai-analysis.port';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DocumentEntity,
      AnalysisEntity,
    ])
  ],
  providers: [
    UserRepositoryAdapter,
    DocumentRepositoryAdapter,
    AnalysisRepositoryAdapter,
    TextExtractorAdapter,
    AnalysisRepositoryAdapter,
    OpenAiAdapter,
    {
      provide: AiAnalysisPortToken,
      useExisting: OpenAiAdapter,
    },

    // Tokens
    { provide: UserRepositoryPortToken, useExisting: UserRepositoryAdapter },
    { provide: DocumentRepositoryPortToken, useExisting: DocumentRepositoryAdapter },
    { provide: AnalysisRepositoryPortToken, useExisting: AnalysisRepositoryAdapter },
    { provide: TextExtractorPortToken, useExisting: TextExtractorAdapter },
    { provide: AnalysisRepositoryPortToken, useExisting: AnalysisRepositoryAdapter },

    // Casos de uso
    GetUserByIdUseCase,
    UploadDocumentUseCase,
    RunAnalysisUseCase,
    GetAnalysisByDocumentUseCase,


  ],
  exports: [
    // Tokens de puertos
    UserRepositoryPortToken,
    DocumentRepositoryPortToken,
    AnalysisRepositoryPortToken,
    TextExtractorPortToken,
    AnalysisRepositoryPortToken,
  // Casos de uso
    GetUserByIdUseCase,
    UploadDocumentUseCase,
    RunAnalysisUseCase,
    GetAnalysisByDocumentUseCase,

    // Opcional
    TypeOrmModule,

  ],
})
export class PersistenceModule {}
