export interface GenericTextAnalysis {
  summary: string;            // resumen general
  legalTerms: string[];       // términos legales detectados
  technicalTerms: string[];   // términos técnicos detectados
  entities: string[];         // nombres propios, instituciones, lugares
  confidence: number;         // 0 a 1
  rawText: string;            // texto original
}

export const GenericTextAnalyzerPortToken = Symbol('GenericTextAnalyzerPort');

export interface GenericTextAnalyzerPort {
  analyze(text: string): Promise<GenericTextAnalysis>;
}