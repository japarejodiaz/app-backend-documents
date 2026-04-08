import { Inject, Injectable } from '@nestjs/common';
import { DocumentRepositoryPortToken } from './document.repository.port';
import type { DocumentRepositoryPort } from './document.repository.port';
import { TextExtractorPortToken } from './text-extractor.port';
import type { TextExtractorPort } from './text-extractor.port';
import { Document } from './document';

@Injectable()
export class UploadDocumentUseCase {
  constructor(
    @Inject(DocumentRepositoryPortToken)
    private readonly documentRepository: DocumentRepositoryPort,
    @Inject(TextExtractorPortToken)
    private readonly textExtractor: TextExtractorPort,
  ) {}

  async execute(input: {
    id: string;
    filename: string;
    mimetype: string;
    size: number;
    storagePath: string;
    userId: string;
  }): Promise<Document> {
    const document = new Document(
      input.id,
      input.filename,
      input.mimetype,
      input.size,
      input.storagePath,
      new Date(),
      'PENDING',
      input.userId,
      undefined,
      undefined,
    );

    await this.documentRepository.save(document);

    const extractedText = await this.textExtractor.extractText(input.storagePath);

    // 3) Determinar estado final
    const finalStatus: 'OK' | 'NOK' =
      extractedText && extractedText.trim().length > 0 ? 'OK' : 'NOK';

    const updatedDocument = new Document(
      document.id,
      document.filename,
      document.mimetype,
      document.size,
      document.storagePath,
      document.createdAt,
      finalStatus,
      document.userId,
      undefined,
      extractedText,

    );

    await this.documentRepository.save(updatedDocument);

    return updatedDocument;
  }
}
