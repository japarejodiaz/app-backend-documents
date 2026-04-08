import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentRepositoryPortToken } from '../../../../Domain/documents/document.repository.port';
import { DeleteDocumentUseCase } from '../../../../Domain/documents/delete-document.usecase';
import { ListDocumentsUseCase } from '../../../../Domain/documents/list-document.usecase';
import { GetDocumentByIdUseCase } from '../../../../Domain/documents/get-document-by-id.usecase';
import { UploadDocumentUseCase } from '../../../../Domain/documents/upload-document-use.case';
import { DocumentEntity } from '../../../persistence/entities/document.entity';
import { DocumentRepositoryAdapter } from '../../../persistence/repositories/document.repository.adapters';
import { DocumentsController } from '../documents.controller';
import { PersistenceModule } from '../../../persistence/persistence.module';

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

    {
      provide: DocumentRepositoryPortToken,
      useClass: DocumentRepositoryAdapter,
    },
  ],
  exports: [
    UploadDocumentUseCase,
    GetDocumentByIdUseCase,
    ListDocumentsUseCase,
    DeleteDocumentUseCase,
  ],
})

export class DocumentsModule {}
