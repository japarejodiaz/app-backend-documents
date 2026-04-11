import { Inject, Injectable } from '@nestjs/common';

import { Analysis } from '../../../Domain/analysis/analysis';
import type { AnalysisRepositoryPort } from '../../../Domain/analysis/analysis.repository.port';
import { AnalysisRepositoryPortToken } from '../../../Domain/analysis/analysis.repository.port';

@Injectable()
export class GetAnalysisByDocumentUseCase {
  constructor(
    @Inject(AnalysisRepositoryPortToken)
    private readonly analysisRepository: AnalysisRepositoryPort,
  ) {}

  async execute(documentId: string): Promise<Analysis[]> {
    return this.analysisRepository.findByDocumentId(documentId);
  }
}
