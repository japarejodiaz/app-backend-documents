import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DocumentRepositoryPort } from '../../../Domain/documents/document.repository.port';
import { Document } from '../../../Domain/documents/document';
import { DocumentEntity } from '../entities/document.entity';
import { DocumentMapper } from '../mappers/document.mapper';

@Injectable()
export class DocumentRepositoryAdapter implements DocumentRepositoryPort {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly repo: Repository<DocumentEntity>
  ) {}

  async save(document: Document): Promise<Document> {
    const entity = this.repo.create(DocumentMapper.toEntity(document));

    await this.repo.save(entity);
    return document;
  }

  async findById(id: string): Promise<Document | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['user', 'analysis']
    });

    return entity ? DocumentMapper.toDomain(entity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findAllByUser(userId: string): Promise<DocumentEntity[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['analysis'],
    });
  }


}
