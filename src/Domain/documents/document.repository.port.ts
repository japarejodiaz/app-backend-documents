import { Document } from "./document";
import { DocumentEntity } from '../../Infrastructure/persistence/entities/document.entity';

export const DocumentRepositoryPortToken = Symbol('DocumentRepositoryPort');

export interface DocumentRepositoryPort {
  save(document: Document): Promise<Document>;
  findById(id: string): Promise<Document | null>;
  // findByUserId(userId: string): Promise<Document[]>;
  delete(id: string): Promise<void>;
  findAllByUser(userId: string): Promise<DocumentEntity[]>;

}