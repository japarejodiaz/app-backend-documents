import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DocumentRepositoryPortToken } from './document.repository.port';
import type { DocumentRepositoryPort } from './document.repository.port';

@Injectable()
export class GetDocumentByIdUseCase {

  private readonly logger = new Logger('GetDocumentByIdUseCase');
  constructor(
    @Inject(DocumentRepositoryPortToken)
    private readonly documentRepository: DocumentRepositoryPort,
  ) {}


  async execute(id: string, userId: string) {
    const doc = await this.documentRepository.findById(id);

    if (!doc) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Validación de propiedad
    if (doc.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este documento');
    }
    this.logger.log(`Documento encontrado: ${doc.id}`);
    this.logger.log(`Documento texto guardado: ${doc.text}`);
    return doc;
  }
}

