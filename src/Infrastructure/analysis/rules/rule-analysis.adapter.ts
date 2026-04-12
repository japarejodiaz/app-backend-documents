import { Injectable } from '@nestjs/common';
import { RuleAnalysisPort } from '../../../Domain/analysis/rule-analysis.port';

@Injectable()
export class RuleAnalysisAdapter implements RuleAnalysisPort {
  async analyze(text: string): Promise<any> {
    const entities = this.extractEntities(text);
    const technicalTerms = this.extractTechnicalTerms(text);
    const clauses = this.extractClauses(text);
    const risks = this.detectRisks(text);

    return {
      summary: text.substring(0, 300) + '...',
      entities,
      technicalTerms,
      clauses,
      risks,
      confidence: 0.75,
      rawText: text,
    };
  }

  private extractEntities(text: string): string[] {
    return text
      .split(/[\s,.:;\n]+/)
      .filter(w => w.length > 3)
      .slice(0, 30);
  }

  private extractTechnicalTerms(text: string): string[] {
    const terms = ['validación', 'contrato', 'riesgo', 'diagnóstico'];
    return terms.filter(t => text.toLowerCase().includes(t));
  }

  private extractClauses(text: string): string[] {
    const patterns = ['obligación', 'responsabilidad', 'plazo', 'confidencialidad'];
    return patterns.filter(p => text.toLowerCase().includes(p));
  }

  private detectRisks(text: string): string[] {
    const risks: string[] = [];
    const lower = text.toLowerCase();

    if (lower.includes('riesgo')) risks.push('Mención explícita de riesgo');
    if (lower.includes('incumplimiento')) risks.push('Posible incumplimiento');
    if (lower.includes('penalidad')) risks.push('Penalidades potenciales');

    return risks;
  }
}



