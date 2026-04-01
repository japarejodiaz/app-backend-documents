import { Inject, Injectable } from '@nestjs/common';

import { Analysis } from './analysis';
import type { AnalysisRepositoryPort } from './analysis.repository.port';

@Injectable()
export class GetAnalysisByDocumentUseCase {
  constructor(
    @Inject('AnalysisRepositoryPort')
    private readonly analysisRepository: AnalysisRepositoryPort,
  ) {}

  async execute(documentId: string): Promise<Analysis[]> {
    return this.analysisRepository.findByDocumentId(documentId);
  }
}
