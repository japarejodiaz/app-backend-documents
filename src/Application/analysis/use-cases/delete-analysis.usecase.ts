import { Inject, NotFoundException } from '@nestjs/common';
import { AnalysisRepositoryPortToken } from '../../../Domain/analysis/analysis.repository.port';
import type { AnalysisRepositoryPort } from '../../../Domain/analysis/analysis.repository.port';

export class DeleteAnalysisUseCase {
  constructor(
    @Inject(AnalysisRepositoryPortToken)
    private readonly repo: AnalysisRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      throw new NotFoundException('Análisis no encontrado');
    }

    await this.repo.delete(id);
  }
}
