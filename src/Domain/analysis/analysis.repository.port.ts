import { Analysis } from './analysis';

export const AnalysisRepositoryPortToken = Symbol('AnalysisRepositoryPort');

export interface AnalysisRepositoryPort {
  save(analysis: Analysis): Promise<Analysis>;
  findById(id: string): Promise<Analysis | null>;
  findByDocumentId(documentId: string): Promise<Analysis[]>;
}