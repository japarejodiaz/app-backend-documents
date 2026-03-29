export interface AiAnalysisPort {
  analyze(documentId: string): Promise<any>;
  analyzeSummary(documentId: string): Promise<any>;
  analyzeKeywords(documentId: string): Promise<any>;
  summarize(text: string): Promise<any>;
  detectTopics(text: string): Promise<any>;
  extractClauses(text: string): Promise<any>;
}