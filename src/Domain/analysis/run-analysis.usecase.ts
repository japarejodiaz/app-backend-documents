import { AiAnalysisPort } from './ai-analysis.port';
import { AnalysisRepositoryPort } from './analysis.repository.port';
import { Analysis } from './analysis';


export class RunAnalysisUseCase {
  constructor(
    private readonly aiAnalysis: AiAnalysisPort,
    private readonly analysisRepository: AnalysisRepositoryPort,
  ) {}


  async execute( input:{
    id: string;
    documentId: string;
    userId: string;
    type: string;
    text: string;
  }): Promise<Analysis> {

    let result;

    switch (input.type) {

      case 'summary':
        result = await this.aiAnalysis.analyzeSummary(input.documentId);
        break;
      case 'clauses':
        result = await this.aiAnalysis.extractClauses(input.text);
        break;
      case 'sentiment':
        result = await this.aiAnalysis.analyzeKeywords(input.documentId);
        break;
      case 'topics':
        result = await this.aiAnalysis.detectTopics(input.text);
        break
      default:
        throw new Error('Invalid analysis type');
    }

    let analysis: Analysis;
    analysis = new Analysis(
      input.id,
      input.documentId,
      input.userId,
      input.type,
      result,
      new Date(),
    );

    await this.analysisRepository.save(analysis);

    return analysis;

  }





}