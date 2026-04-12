import { Inject, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import type { AiAnalysisPort } from '../../../Domain/analysis/ai-analysis.port';

@Injectable()
export class OpenAiAdapter implements AiAnalysisPort {
  private readonly client: OpenAI;
  private readonly apiKey = process.env.AI_API_KEY;
  private readonly model: string = process.env.AI_MODEL || 'gpt-4o-mini';
  private readonly logger = new Logger(OpenAiAdapter.name);

  constructor() {
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  // Análisis IA completo (flujo módulo de análisis)
  async analyze(text: string): Promise<any> {
    return this.safeCall(text);
  }

  // Análisis rápido (mismo motor, otro endpoint)
  async analyzeText(text: string): Promise<any> {
    return this.safeCall(text);
  }

  // Orquestador seguro: llama a la IA, limpia, parsea y hace fallback si algo falla
  private async safeCall(text: string): Promise<any> {
    try {
      const prompt = this.buildPrompt(text);
      const rawResponse = await this.callModel(prompt);

      const cleaned = this.cleanJsonResponse(rawResponse);

      try {
        const parsed = JSON.parse(cleaned);

        // Normalizamos la estructura mínima esperada
        return {
          summary: parsed.summary ?? text.substring(0, 200) + '...',
          keywords: parsed.keywords ?? [],
          topics: parsed.topics ?? [],
          clauses: parsed.clauses ?? [],
          risks: parsed.risks ?? [],
        };
      } catch {
        this.logger.warn('La IA devolvió texto no JSON parseable, usando fallback con raw');
        return {
          summary: text.substring(0, 200) + '...',
          keywords: [],
          topics: [],
          clauses: [],
          risks: [],
          raw: cleaned,
        };
      }
    } catch (error) {
      this.logger.error('Error llamando a OpenAI', error as any);

      // Fallback duro pero estable
      return {
        summary: text.substring(0, 200) + '...',
        keywords: [],
        topics: [],
        clauses: [],
        risks: [],
        error: 'AI service unavailable, fallback result generated',
      };
    }
  }

  private buildPrompt(text: string): string {
    return `
      Analiza el siguiente texto legal/médico y responde SOLO con un JSON válido con esta forma:

      {
        "summary": "string",
        "keywords": ["string"],
        "topics": ["string"],
        "clauses": ["string"],
        "risks": ["string"]
      }

      No incluyas explicaciones, ni texto fuera del JSON, ni bloques de código.

      Texto:
      ${text}
    `;
  }

  private async callModel(prompt: string): Promise<string> {
    this.logger.log('Llamando a OpenAI con modelo: ' + this.model);

    const response = await this.client.chat.completions.create({
      model: this.model as any,
      messages: [
        {
          role: 'system',
          content:
            'Eres un analista legal/médico experto. Responde SIEMPRE con JSON válido, sin bloques ``` y sin texto adicional.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const content = response.choices[0].message.content ?? '{}';

    this.logger.log('Respuesta de OpenAI recibida');
    this.logger.debug(content);

    return content;
  }

  // Limpia bloques ```json ... ``` si el modelo insiste en devolver Markdown
  private cleanJsonResponse(content: string): string {
    return content
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
  }
}

