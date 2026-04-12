import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

// Tokens
import { AiAnalysisPortToken } from '../../../Domain/analysis/ai-analysis.port';
import { RuleAnalysisPortToken } from '../../../Domain/analysis/rule-analysis.port';
import { AnalysisRepositoryPortToken } from '../../../Domain/analysis/analysis.repository.port';
import { DocumentRepositoryPortToken } from '../../../Domain/documents/document.repository.port';

// Puertos
import type { AiAnalysisPort } from '../../../Domain/analysis/ai-analysis.port';
import type { RuleAnalysisPort } from '../../../Domain/analysis/rule-analysis.port';
import type { AnalysisRepositoryPort } from '../../../Domain/analysis/analysis.repository.port';
import type { DocumentRepositoryPort } from '../../../Domain/documents/document.repository.port';
import { RunAnalysisDto } from '../../../Infrastructure/controllers/analysis/dto/run-analysis.dto';
import { Analysis } from '../../../Domain/analysis/analysis';



@Injectable()
export class RunAnalysisUseCase {
  constructor(
    @Inject(AiAnalysisPortToken)
    private readonly aiAnalysis: AiAnalysisPort,

    @Inject(RuleAnalysisPortToken)
    private readonly ruleAnalysis: RuleAnalysisPort,

    @Inject(AnalysisRepositoryPortToken)
    private readonly analysisRepository: AnalysisRepositoryPort,

    @Inject(DocumentRepositoryPortToken)
    private readonly documentRepository: DocumentRepositoryPort,
  ) {}

  async execute(input: RunAnalysisDto): Promise<Analysis> {
    // 1) Validar documento
    const document = await this.documentRepository.findById(input.documentId);

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    if (document.text == null) {
      throw new Error('El documento no tiene texto extraído');
    }

    // 2) Validar estado
    if (document.status !== 'OK') {
      throw new BadRequestException('El documento no está listo para análisis');
    }

// 3) Validar usuario dueño del documento
    if (document.userId !== input.userId) {
      throw new ForbiddenException('No tienes permiso para analizar este documento');
    }


    // 2) Ejecutar análisis por reglas
    const ruleBased = await this.ruleAnalysis.analyze(document.text);

    // 3) Ejecutar análisis IA
    const aiBased = await this.aiAnalysis.analyze(document.text);

    // 4) Consolidar
    const result = {
      summary: aiBased.summary,
      keywords: aiBased.keywords,
      entities: aiBased.entities,
      risks: aiBased.risks,
      ruleBased,
      aiBased,
    };

    // 5) Crear entidad de dominio
    const analysis = new Analysis(
      randomUUID(),
      input.documentId,
      input.userId,
      input.type,
      result,
      new Date(),
    );

    // 6) Guardar
    await this.analysisRepository.save(analysis);

    return analysis;
  }
}