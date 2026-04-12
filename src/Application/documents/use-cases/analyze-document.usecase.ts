import { Inject, Injectable, NotFoundException } from '@nestjs/common';




import { randomUUID } from 'crypto';
import { DocumentRepositoryPortToken } from '../../../Domain/documents/document.repository.port';
import type { DocumentRepositoryPort } from '../../../Domain/documents/document.repository.port';
import { AiAnalysisPortToken } from '../../../Domain/analysis/ai-analysis.port';
import type { AiAnalysisPort } from '../../../Domain/analysis/ai-analysis.port';
import { AnalysisRepositoryPortToken } from '../../../Domain/analysis/analysis.repository.port';
import type { AnalysisRepositoryPort } from '../../../Domain/analysis/analysis.repository.port';
import { RuleAnalysisPortToken } from '../../../Domain/analysis/rule-analysis.port';
import type { RuleAnalysisPort } from '../../../Domain/analysis/rule-analysis.port';


@Injectable()
export class AnalyzeDocumentUseCase {
  constructor(
    @Inject(DocumentRepositoryPortToken)
    private readonly documents: DocumentRepositoryPort,

    @Inject(AiAnalysisPortToken)
    private readonly ai: AiAnalysisPort,

    @Inject(RuleAnalysisPortToken)
    private readonly rules: RuleAnalysisPort,

    @Inject(AnalysisRepositoryPortToken)
    private readonly analysisRepo: AnalysisRepositoryPort,
  ) {}

  async execute(documentId: string) {
    const doc = await this.documents.findById(documentId);
    if (!doc) throw new NotFoundException('Documento no encontrado');

    // 1) Texto limpio
    const text = doc.text;
    if (!text) {
      throw new Error('El documento no tiene texto extraído');
    }
    // 2) Análisis por reglas
    const ruleBased = await this.rules.analyze(text);

    // 3) Análisis IA
    const aiBased = await this.ai.analyze(documentId);

    // 4) Consolidación compatible con tu entidad Analysis
    const consolidated = {
      id: randomUUID(),
      documentId,
      userId: doc.userId!,   // si tu documento tiene userId
      type: 'full',         // o el tipo que uses
      result: {
        summary: aiBased.summary,
        keywords: aiBased.keywords,
        entities: aiBased.entities,
        risks: aiBased.risks,
        ruleBased,
        aiBased,
      },
      createdAt: new Date(),
    };

    // 5) Guardar análisis
    await this.analysisRepo.save(consolidated);

    return consolidated;
  }

}