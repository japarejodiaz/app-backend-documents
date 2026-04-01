export const AiAnalysisPortToken = Symbol('AiAnalysisPort');

export interface AiAnalysisPort {
  analyze(documentId: string): Promise<any>;
  analyzeSummary(documentId: string): Promise<any>;
  analyzeKeywords(documentId: string): Promise<any>;
  summarize(text: string): Promise<any>;
  detectTopics(documentId: string): Promise<any>;
  extractClauses(documentId: string): Promise<any>;
}