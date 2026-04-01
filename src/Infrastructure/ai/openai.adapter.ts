import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import type { AiAnalysisPort } from '../../Domain/analysis/ai-analysis.port';
import { DocumentRepositoryPortToken } from '../../Domain/documents/document.repository.port';
import type { DocumentRepositoryPort } from '../../Domain/documents/document.repository.port';


@Injectable()
export class OpenAiAdapter implements AiAnalysisPort {
  private readonly client: OpenAI;

  constructor(
    @Inject(DocumentRepositoryPortToken)
    private readonly documentRepo: DocumentRepositoryPort,
  ) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyze(documentId: string): Promise<any> {
    const doc = await this.documentRepo.findById(documentId);
    if (!doc) throw new Error('Document not found');

    const text = doc.text ?? '';

    return this.callModel(`
      Analiza el siguiente texto legal y devuelve:
      - Resumen
      - Palabras clave
      - Temas principales
      - Cláusulas importantes
      - Riesgos potenciales

      Texto:
      ${text}
    `);
  }

  async analyzeSummary(documentId: string): Promise<any> {
    const doc = await this.documentRepo.findById(documentId);
    if (!doc) throw new Error('Document not found');

    return this.summarize(doc.text ?? '');
  }

  async analyzeKeywords(documentId: string): Promise<any> {
    const doc = await this.documentRepo.findById(documentId);
    if (!doc) throw new Error('Document not found');

    return this.callModel(`
      Extrae las palabras clave más relevantes del siguiente texto:
      ${doc.text ?? ''}
    `);
  }

  async summarize(text: string): Promise<any> {
    return this.callModel(`
      Resume el siguiente texto legal en 5 puntos claros:
      ${text}
    `);
  }

  async extractClauses(documentId: string): Promise<any> {
    const doc = await this.documentRepo.findById(documentId);
    if (!doc) throw new Error('Document not found');

    return this.callModel(`
      Extrae las cláusulas más importantes del siguiente texto legal:
      ${doc.text ?? ''}
    `);
  }

  async detectTopics(documentId: string): Promise<any> {
    const doc = await this.documentRepo.findById(documentId);
    if (!doc) throw new Error('Document not found');

    return this.callModel(`
      Identifica los temas principales del siguiente texto legal:
      ${doc.text ?? ''}
    `);
  }

  private async callModel(prompt: string): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Eres un analista legal experto.' },
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0].message.content;
  }
}
