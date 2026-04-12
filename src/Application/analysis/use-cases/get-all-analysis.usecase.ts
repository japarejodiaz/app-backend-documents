import { Inject } from '@nestjs/common';
import { AnalysisRepositoryPortToken } from '../../../Domain/analysis/analysis.repository.port';
import type { AnalysisRepositoryPort } from '../../../Domain/analysis/analysis.repository.port';

export class GetAllAnalysisUseCase {
  constructor(
    @Inject(AnalysisRepositoryPortToken)
    private readonly repo: AnalysisRepositoryPort,
  ) {}

  async execute() {
    return this.repo.findAll();
  }
}