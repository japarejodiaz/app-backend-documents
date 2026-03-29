import { DocumentEntity } from '../entities/document.entity';
import { Document } from '../../../Domain/documents/document';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentRepositoryPort } from '../../../Domain/documents/document.repository.port';

@Injectable()
export class DocumentRepositoryAdapter implements DocumentRepositoryPort {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly repo: Repository<DocumentEntity>
  ) {}

  async save(document: Document): Promise<Document> {
    const entity = this.repo.create({
      id: document.id,
      filename: document.filename,
      mimetype: document.mimetype,
      size: document.size,
      storagePath: document.storagePath,
      user: { id: document.userId }
    });

    await this.repo.save(entity);
    return document;
  }

  async findById(id: string): Promise<Document | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['user', 'analysis']
    });

    if (!entity) return null;

    return new Document(
      entity.id,
      entity.filename,
      entity.mimetype,
      entity.size,
      entity.storagePath,
      entity.createdAt,
      entity.user?.id,
      entity.analysis?.[0]?.id
    );
  }
}
