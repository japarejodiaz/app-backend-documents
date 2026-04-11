import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { AiAnalysisPort } from '../../Domain/analysis/ai-analysis.port';
import { DocumentRepositoryPortToken } from '../../Domain/documents/document.repository.port';
import type { DocumentRepositoryPort } from '../../Domain/documents/document.repository.port';

@Injectable()
export class OpenAiAdapter implements AiAnalysisPort {
  private readonly client: OpenAI;
  private readonly apiKey = process.env.AI_API_KEY;
  private readonly model: string = process.env.AI_MODEL || 'gpt-4o-mini';


  constructor(
    @Inject(DocumentRepositoryPortToken)
    private readonly documentRepo: DocumentRepositoryPort,
  ) {
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  // 🔥 Pipeline original: analiza documento guardado
  async analyze(documentId: string): Promise<any> {
    const doc = await this.documentRepo.findById(documentId);
    if (!doc) throw new Error('Document not found');

    const text = doc.text ?? '';
    return this.callModel(this.buildPrompt(text));
  }

  // 🔥 Pipeline rápido: analiza texto directo
  async analyzeText(text: string): Promise<any> {
    return this.callModel(this.buildPrompt(text));
  }

  private buildPrompt(text: string): string {
    return `
      Analiza el siguiente texto legal y devuelve:
      - Resumen
      - Palabras clave
      - Temas principales
      - Cláusulas importantes
      - Riesgos potenciales

      Texto:
      ${text}
    `;
  }

  private async callModel(prompt: string): Promise<any> {
    const response = await this.client.chat.completions.create({
        model: this.model as any,
      messages: [
        { role: 'system', content: 'Eres un analista legal experto.' },
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0].message.content;
  }

}