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
    // Adaptadores concretos
    UserRepositoryAdapter,
    DocumentRepositoryAdapter,
    AnalysisRepositoryAdapter,
    OpenAiAdapter,

    // Puertos → adaptadores
    { provide: UserRepositoryPortToken, useExisting: UserRepositoryAdapter },
    { provide: DocumentRepositoryPortToken, useExisting: DocumentRepositoryAdapter },
    { provide: AnalysisRepositoryPortToken, useExisting: AnalysisRepositoryAdapter },
    { provide: AiAnalysisPortToken, useExisting: OpenAiAdapter },
  ],
  exports: [
    // Exportamos puertos
    UserRepositoryPortToken,
    DocumentRepositoryPortToken,
    AnalysisRepositoryPortToken,
    AiAnalysisPortToken,

    // Exportamos TypeORM
    TypeOrmModule,
  ],
})
export class PersistenceModule {}