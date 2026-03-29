import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { DocumentEntity } from './entities/document.entity';
import { AnalysisEntity } from './entities/analysis.entity';

import { UserRepositoryAdapter } from './repositories/user-repository.adapter';
import { DocumentRepositoryAdapter } from './repositories/document.repository.adapters';
import { AnalysisRepositoryAdapter } from './repositories/analysis-repository.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DocumentEntity,
      AnalysisEntity,
    ]),
  ],
  providers: [
    UserRepositoryAdapter,
    DocumentRepositoryAdapter,
    AnalysisRepositoryAdapter,
  ],
  exports: [
    UserRepositoryAdapter,
    TypeOrmModule,
    DocumentRepositoryAdapter,
    AnalysisRepositoryAdapter,
  ],
})
export class PersistenceModule {}
