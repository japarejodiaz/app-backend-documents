export const AiAnalysisPortToken = Symbol('AiAnalysisPort');

export interface AiAnalysisPort {

  analyze(text: string): Promise<any>;        // análisis IA completo
  analyzeText(text: string): Promise<any>;    // análisis rápido (DocumentsController)

// pipeline rápido
/*  analyzeSummary(documentId: string): Promise<any>;
  analyzeKeywords(documentId: string): Promise<any>;
  summarize(text: string): Promise<any>;
  detectTopics(documentId: string): Promise<any>;
  extractClauses(documentId: string): Promise<any>;*/
}