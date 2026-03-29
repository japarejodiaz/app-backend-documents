import { AnalysisEntity } from '../entities/analysis.entity';
import { Analysis } from '../../../Domain/analysis/analysis';

export class AnalysisMapper {
  static toDomain(entity: AnalysisEntity): Analysis {
    return new Analysis(
      entity.id,
      entity.document.id,
      entity.user.id,
      entity.type,
      entity.result,
      entity.createdAt
    );
  }

  static toEntity(domain: Analysis): Partial<AnalysisEntity> {
    return {
      id: domain.id,
      type: domain.type,
      result: domain.result,
      document: { id: domain.documentId } as any,
      user: { id: domain.userId } as any,
      createdAt: domain.createdAt
    };
  }
}
