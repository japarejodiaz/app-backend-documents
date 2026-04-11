export const AiAnalysisPortToken = Symbol('AiAnalysisPort');

export interface AiAnalysisPort {
  analyze(documentId: string): Promise<any>;   // pipeline original
  analyzeText(text: string): Promise<any>;     // pipeline rápido
/*  analyzeSummary(documentId: string): Promise<any>;
  analyzeKeywords(documentId: string): Promise<any>;
  summarize(text: string): Promise<any>;
  detectTopics(documentId: string): Promise<any>;
  extractClauses(documentId: string): Promise<any>;*/
}