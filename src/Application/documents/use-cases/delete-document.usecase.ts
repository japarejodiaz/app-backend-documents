import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentRepositoryPortToken } from '../../../Domain/documents/document.repository.port';
import type { DocumentRepositoryPort } from '../../../Domain/documents/document.repository.port';

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject(DocumentRepositoryPortToken)
    private readonly documentRepository: DocumentRepositoryPort,
  ) {}

  async execute(id: string, userId): Promise<void> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Validación de propiedad
    if (document.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este documento');
    }

    await this.documentRepository.delete(id);
  }
}
