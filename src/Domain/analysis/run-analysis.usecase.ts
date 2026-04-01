import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import type { AiAnalysisPort } from './ai-analysis.port';
import type { AnalysisRepositoryPort } from './analysis.repository.port';
import { Analysis } from './analysis';
import { RunAnalysisDto } from '../../Infrastructure/controllers/analysis/dto/run-analysis.dto';

@Injectable()
export class RunAnalysisUseCase {
  constructor(
    @Inject('AiAnalysisPort')
    private readonly aiAnalysis: AiAnalysisPort,
    @Inject('AnalysisRepositoryPort')
    private readonly analysisRepository: AnalysisRepositoryPort,
  ) {}

  async execute(input: RunAnalysisDto): Promise<Analysis> {
    let result;

    switch (input.type) {
      case 'summary':
        result = await this.aiAnalysis.analyzeSummary(input.documentId);
        break;

      case 'keywords':
        result = await this.aiAnalysis.analyzeKeywords(input.documentId);
        break;

      case 'clauses':
        result = await this.aiAnalysis.extractClauses(input.documentId);
        break;

      case 'topics':
        result = await this.aiAnalysis.detectTopics(input.documentId);
        break;

      case 'full':
        result = await this.aiAnalysis.analyze(input.documentId);
        break;

      default:
        throw new Error('Invalid analysis type');
    }

    const analysis = new Analysis(
      randomUUID(),
      input.documentId,
      input.userId,
      input.type,
      result,
      new Date(),
    );

    await this.analysisRepository.save(analysis);

    return analysis;
  }
}
