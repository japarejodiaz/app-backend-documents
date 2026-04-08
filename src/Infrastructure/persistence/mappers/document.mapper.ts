import { DocumentEntity } from '../entities/document.entity';
import { Document } from '../../../Domain/documents/document';
import { UserEntity } from '../entities/user.entity';

export class DocumentMapper {
  static toDomain(entity: DocumentEntity): Document {
    return new Document(
      entity.id,
      entity.filename,
      entity.mimetype,
      entity.size,
      entity.storagePath,
      entity.createdAt,
      entity.status,
      entity.user?.id,
      entity.analysis?.[0]?.id,
      entity.text,
    );
  }

  static toEntity(domain: Document): Partial<DocumentEntity> {
    return {
      id: domain.id,
      filename: domain.filename,
      mimetype: domain.mimetype,
      size: domain.size,
      storagePath: domain.storagePath,
      createdAt: domain.createdAt,
      status: domain.status,
      user: domain.userId ? ({ id: domain.userId } as unknown as UserEntity) : undefined,
      analysis: [],
      text: domain.text,
    };
  }
}
