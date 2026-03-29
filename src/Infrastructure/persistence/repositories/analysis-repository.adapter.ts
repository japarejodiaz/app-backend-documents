import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { AnalysisEntity } from '../entities/analysis.entity';
import { AnalysisMapper } from '../mappers/analysis.mapper';
import { Analysis } from '../../../Domain/analysis/analysis';
import { AnalysisRepositoryPort } from '../../../Domain/analysis/analysis.repository.port';


@Injectable()
export class AnalysisRepositoryAdapter implements AnalysisRepositoryPort {
  constructor(
    @InjectRepository(AnalysisEntity)
    private readonly repo: Repository<AnalysisEntity>,
  ) {}

  async findByDocumentId(documentId: string): Promise<Analysis[]> {
    const entities = await this.repo.find({
      where: { document: { id: documentId } },
      relations: ['document', 'user'],
       });

       return entities.map(AnalysisMapper.toDomain);
    }

  async save(analysis: Analysis): Promise<Analysis> {
    const entity = this.repo.create(AnalysisMapper.toEntity(analysis));
    await this.repo.save(entity);
    return analysis;
  }

  async findById(id: string): Promise<Analysis | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['document', 'user'],
    });

    return entity ? AnalysisMapper.toDomain(entity) : null;
  }

}
