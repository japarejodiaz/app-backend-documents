import { Inject, NotFoundException } from '@nestjs/common';
import { AnalysisRepositoryPortToken } from '../../../Domain/analysis/analysis.repository.port';
import type  { AnalysisRepositoryPort } from '../../../Domain/analysis/analysis.repository.port';

export class GetAnalysisByIdUseCase {
  constructor(
    @Inject(AnalysisRepositoryPortToken)
    private readonly repo: AnalysisRepositoryPort,
  ) {}

  async execute(id: string) {
    const analysis = await this.repo.findById(id);
    if (!analysis) {
      throw new NotFoundException('Análisis no encontrado');
    }
    return analysis;
  }
}

