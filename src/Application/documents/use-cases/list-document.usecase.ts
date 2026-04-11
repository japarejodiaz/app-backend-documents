import { Inject, Injectable } from '@nestjs/common';
import { DocumentRepositoryPortToken } from '../../../Domain/documents/document.repository.port';
import type { DocumentRepositoryPort  } from '../../../Domain/documents/document.repository.port';


@Injectable()
export class ListDocumentsUseCase {
  constructor(
    @Inject(DocumentRepositoryPortToken)
    private readonly documentRepository: DocumentRepositoryPort,
  ) {}

  async execute(userId: string) {
    return this.documentRepository.findAllByUser(userId);
  }
}

