import { Inject } from '@nestjs/common';
import { AnalysisRepositoryPortToken } from '../../../Domain/analysis/analysis.repository.port';
import type { AnalysisRepositoryPort } from '../../../Domain/analysis/analysis.repository.port';

export class GetAnalysisByUserUseCase {
  constructor(
    @Inject(AnalysisRepositoryPortToken)
    private readonly repo: AnalysisRepositoryPort,
  ) {}

  async execute(userId: string) {
    return this.repo.findByUserId(userId);
  }
}
