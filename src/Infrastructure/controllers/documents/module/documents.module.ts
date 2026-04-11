import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentRepositoryPortToken } from '../../../../Domain/documents/document.repository.port';
import { DeleteDocumentUseCase } from '../../../../Application/documents/use-cases/delete-document.usecase';
import { ListDocumentsUseCase } from '../../../../Application/documents/use-cases/list-document.usecase';
import { GetDocumentByIdUseCase } from '../../../../Application/documents/use-cases/get-document-by-id.usecase';
import { UploadDocumentUseCase } from '../../../../Application/documents/use-cases/upload-document-use.case';
import { DocumentEntity } from '../../../persistence/entities/document.entity';
import { DocumentRepositoryAdapter } from '../../../persistence/repositories/document.repository.adapters';
import { DocumentsController } from '../documents.controller';
import { PersistenceModule } from '../../../persistence/persistence.module';
import { AnalyzeGenericTextUseCase } from '../../../../Application/documents/use-cases/analyze-generic-text.usecase';
import { TextExtractorPortToken } from '../../../../Domain/documents/text-extractor.port';
import { TextExtractorAdapter } from '../../../persistence/repositories/text-extractor.adapter';
import { GenericTextAnalyzerPortToken } from '../../../../Domain/documents/generic-text-analyzer.port';
import { GenericTextAnalyzerAdapter } from '../../../persistence/repositories/generic-text-analyzer.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity]),
    PersistenceModule
  ],
  controllers: [DocumentsController],
  providers: [
    UploadDocumentUseCase,
    GetDocumentByIdUseCase,
    ListDocumentsUseCase,
    DeleteDocumentUseCase,
    AnalyzeGenericTextUseCase,
    {
      provide: DocumentRepositoryPortToken,
      useClass: DocumentRepositoryAdapter,
    },
    {
      provide: TextExtractorPortToken,
      useClass: TextExtractorAdapter,
    },
    {
      provide: GenericTextAnalyzerPortToken,
      useClass: GenericTextAnalyzerAdapter,
    }
  ],
  exports: [
    UploadDocumentUseCase,
    GetDocumentByIdUseCase,
    ListDocumentsUseCase,
    DeleteDocumentUseCase,
    AnalyzeGenericTextUseCase,
  ],
})

export class DocumentsModule {}
