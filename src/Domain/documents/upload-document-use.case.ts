import { DocumentRepositoryPort } from './document.repository.port';
import { TextExtractorPort } from './text-extractor.port';
import { Document } from './document';


export class UploadDocumentUseCase {
  constructor(
    private readonly documentRepository: DocumentRepositoryPort,
    private readonly textExtractor: TextExtractorPort,
  ){}

  async execute(input: {
    id: string;
    filename: string;
    mimetype: string;
    size: number;
    storagePath: string;
    userId: string;
  }): Promise< { document: Document; extractedText: string }> {
    const document = new Document(
      input.id,
      input.filename,
      input.mimetype,
      input.size,
      input.storagePath,
      new Date()
    );

    await this.documentRepository.save(document);

    const extractedText = await this.textExtractor.extractText(input.storagePath);

    return { document, extractedText };
  }
}