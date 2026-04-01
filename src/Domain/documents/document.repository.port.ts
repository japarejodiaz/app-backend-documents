import { Document } from "./document";

export const DocumentRepositoryPortToken = Symbol('DocumentRepositoryPort');

export interface DocumentRepositoryPort {
  save(document: Document): Promise<Document>;
  findById(id: string): Promise<Document | null>;
  // findByUserId(userId: string): Promise<Document[]>;
}