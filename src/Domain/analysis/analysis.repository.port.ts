import { Analysis } from './analysis';


export interface AnalysisRepositoryPort {
  save(analysis: Analysis): Promise<Analysis>;
  findById(id: string): Promise<Analysis | null>;
  findByDocumentId(documentId: string): Promise<Analysis[]>;
}