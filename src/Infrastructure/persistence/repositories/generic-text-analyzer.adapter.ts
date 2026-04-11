import { Injectable, Logger } from '@nestjs/common';
import { GenericTextAnalyzerPort, GenericTextAnalysis } from 'src/Domain/documents/generic-text-analyzer.port';

@Injectable()
export class GenericTextAnalyzerAdapter implements GenericTextAnalyzerPort {
  private readonly logger = new Logger(GenericTextAnalyzerAdapter.name);

  async analyze(text: string): Promise<GenericTextAnalysis> {
    const cleaned = text.trim();

    if (!cleaned) {
      return {
        summary: '',
        legalTerms: [],
        technicalTerms: [],
        entities: [],
        confidence: 0,
        rawText: text
      };
    }

    const summary = this.generateSummary(cleaned);
    const legalTerms = this.detectLegalTerms(cleaned);
    const technicalTerms = this.detectTechnicalTerms(cleaned);
    const entities = this.detectEntities(cleaned);

    const confidence = this.calculateConfidence({
      summary,
      legalTerms,
      technicalTerms,
      entities
    });

    return {
      summary,
      legalTerms,
      technicalTerms,
      entities,
      confidence,
      rawText: cleaned
    };
  }

  private generateSummary(text: string): string {
    const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
    return sentences.slice(0, 2).join('. ') + '.';
  }

  private detectLegalTerms(text: string): string[] {
    const terms = [
      'resolución', 'certifica', 'declara', 'domicilio', 'ministerio',
      'autoridad', 'documento', 'constancia', 'vigencia', 'jurisdicción'
    ];

    return terms.filter(t => text.toLowerCase().includes(t));
  }

  private detectTechnicalTerms(text: string): string[] {
    const terms = [
      'sistema', 'proceso', 'digital', 'validación', 'registro',
      'identificación', 'formulario', 'procedimiento'
    ];

    return terms.filter(t => text.toLowerCase().includes(t));
  }

  private detectEntities(text: string): string[] {
    const matches = text.match(/[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*/g);
    return matches ? Array.from(new Set(matches)) : [];
  }

  private calculateConfidence(data: any): number {
    let score = 0;

    if (data.summary.length > 20) score++;
    if (data.legalTerms.length > 0) score++;
    if (data.technicalTerms.length > 0) score++;
    if (data.entities.length > 0) score++;

    return score / 4;
  }
}