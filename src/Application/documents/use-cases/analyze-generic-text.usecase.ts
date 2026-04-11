import { Inject, Injectable } from '@nestjs/common';
import { TextExtractorPortToken } from '../../../Domain/documents/text-extractor.port';
import type { TextExtractorPort } from '../../../Domain/documents/text-extractor.port';
import { GenericTextAnalyzerPortToken } from 'src/Domain/documents/generic-text-analyzer.port';
import type { GenericTextAnalyzerPort } from 'src/Domain/documents/generic-text-analyzer.port';
import { AiAnalysisPortToken } from '../../../Domain/analysis/ai-analysis.port';
import type { AiAnalysisPort } from '../../../Domain/analysis/ai-analysis.port';

@Injectable()
export class AnalyzeGenericTextUseCase {
  constructor(
    @Inject(TextExtractorPortToken)
    private readonly extractor: TextExtractorPort,
    @Inject(GenericTextAnalyzerPortToken)
    private readonly analyzer: GenericTextAnalyzerPort,
    @Inject(AiAnalysisPortToken)
    private readonly ai: AiAnalysisPort,
  ) {}

  async execute(filePath: string) {
    const text = await this.extractor.extractText(filePath);

    const ruleBased = await this.analyzer.analyze(text);
    const aiBased = await this.ai.analyzeText(text);

    return {
      text,
      ruleBased,
      aiBased,
    };
  }
}
