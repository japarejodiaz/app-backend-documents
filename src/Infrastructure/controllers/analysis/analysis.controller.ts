import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RunAnalysisUseCase } from '../../../Domain/analysis/run-analysis.usecase';
import { GetAnalysisByDocumentUseCase } from '../../../Domain/analysis/get-analysis-by-document.usecase';
import { RunAnalysisDto } from './dto/run-analysis.dto';
import { AnalysisResponseDto } from './dto/analysis-response.dto';

@ApiTags('Analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly runAnalysis: RunAnalysisUseCase,
    private readonly getAnalysisByDocument: GetAnalysisByDocumentUseCase,
  ) {}

  @Post('run')
  @ApiOperation({ summary: 'Ejecuta un análisis IA sobre un documento' })
  @ApiResponse({ status: 201, type: AnalysisResponseDto })
  async run(@Body() dto: RunAnalysisDto): Promise<AnalysisResponseDto> {
    const analysis = await this.runAnalysis.execute(dto);

    return {
      id: analysis.id,
      documentId: analysis.documentId,
      userId: analysis.userId,
      type: analysis.type,
      result: analysis.result,
      createdAt: analysis.createdAt,
    };
  }

  @Get('by-document/:id')
  @ApiOperation({ summary: 'Obtiene todos los análisis de un documento' })
  @ApiResponse({ status: 200, type: [AnalysisResponseDto] })
  async getByDocument(@Param('id') id: string): Promise<AnalysisResponseDto[]> {
    const analyses = await this.getAnalysisByDocument.execute(id);

    return analyses.map(a => ({
      id: a.id,
      documentId: a.documentId,
      userId: a.userId,
      type: a.type,
      result: a.result,
      createdAt: a.createdAt,
    }));
  }
}

