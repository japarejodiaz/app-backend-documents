import { Controller, Post, Body, Get, Param, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { RunAnalysisUseCase } from '../../../Application/analysis/use-cases/run-analysis.usecase';
import { GetAnalysisByDocumentUseCase } from '../../../Application/analysis/use-cases/get-analysis-by-document.usecase';
import { RunAnalysisDto } from './dto/run-analysis.dto';
import { AnalysisResponseDto } from './dto/analysis-response.dto';
import { DeleteAnalysisUseCase } from '../../../Application/analysis/use-cases/delete-analysis.usecase';
import { GetAnalysisByUserUseCase } from '../../../Application/analysis/use-cases/get-analysis-by-user.usecase';
import { GetAnalysisByIdUseCase } from '../../../Application/analysis/use-cases/get-analysis-by-id.usecase';
import { GetAllAnalysisUseCase } from '../../../Application/analysis/use-cases/get-all-analysis.usecase';
import { JwtAuthGuard } from '../../../Application/auth/guards/jwt.guard';

@ApiTags('Analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly runAnalysis: RunAnalysisUseCase,
    private readonly getAnalysisByDocument: GetAnalysisByDocumentUseCase,
    private readonly getAnalysisById: GetAnalysisByIdUseCase,
    private readonly getAnalysisByUser: GetAnalysisByUserUseCase,
    private readonly getAllAnalysis: GetAllAnalysisUseCase,
    private readonly deleteAnalysis: DeleteAnalysisUseCase,

  ) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtiene todos los análisis' })
  @ApiResponse({ status: 200, type: [AnalysisResponseDto] })
  async getAll(): Promise<AnalysisResponseDto[]> {
    const analyses = await this.getAllAnalysis.execute();
    return analyses.map(a => this.toDto(a));
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un análisis por ID' })
  @ApiResponse({ status: 200, type: AnalysisResponseDto })
  async getById(@Param('id') id: string): Promise<AnalysisResponseDto> {
    const analysis = await this.getAnalysisById.execute(id);
    return this.toDto(analysis);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('by-user/:id')
  @ApiOperation({ summary: 'Obtiene análisis por usuario' })
  @ApiResponse({ status: 200, type: [AnalysisResponseDto] })
  async getByUser(@Param('id') id: string): Promise<AnalysisResponseDto[]> {
    const analyses = await this.getAnalysisByUser.execute(id);
    return analyses.map(a => this.toDto(a));
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un análisis' })
  @ApiResponse({ status: 204 })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteAnalysis.execute(id);
  }

  private toDto(a: any): AnalysisResponseDto {
    return {
      id: a.id,
      documentId: a.documentId,
      userId: a.userId,
      type: a.type,
      result: a.result,
      createdAt: a.createdAt,
    };
  }
}




