import { randomUUID } from 'crypto';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException, UseGuards, Get, Param, Delete, Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

import { UploadDocumentUseCase } from '../../../Application/documents/use-cases/upload-document-use.case';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { JwtAuthGuard } from '../../../Application/auth/guards/jwt.guard';
import { GetDocumentByIdUseCase } from '../../../Application/documents/use-cases/get-document-by-id.usecase';
import { DeleteDocumentUseCase } from '../../../Application/documents/use-cases/delete-document.usecase';
import { ListDocumentsUseCase } from '../../../Application/documents/use-cases/list-document.usecase';
import { AnalyzeGenericTextUseCase } from '../../../Application/documents/use-cases/analyze-generic-text.usecase';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly uploadDocument: UploadDocumentUseCase,
              private readonly getDocumentById: GetDocumentByIdUseCase,
              private readonly listDocumentsUseCase: ListDocumentsUseCase,
              private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
              private readonly analyzeGenericTextUseCase: AnalyzeGenericTextUseCase,) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @ApiOperation({ summary: 'Sube un documento y extrae su texto' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'static', 'uploads'),
        filename: (_req, file, cb) => {
          const unique = randomUUID();
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiBody({
    description: 'Archivo a subir',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<DocumentResponseDto> {
    if (!file) {
      throw new BadRequestException('El archivo es requerido');
    }

    const document = await this.uploadDocument.execute({
      id: randomUUID(),
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      storagePath: file.path,
      userId: req.user.userId,
    });

    return {
      id: document.id,
      filename: document.filename,
      mimetype: document.mimetype,
      size: document.size,
      storagePath: document.storagePath,
      createdAt: document.createdAt,
      status: document.status,
      userId: document.userId,
      text: document.text,

    };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un documento por ID' })
  @ApiResponse({ status: 200, type: DocumentResponseDto })
  async getDocument(@Param('id') id: string, @Req() req: any): Promise<DocumentResponseDto> {
    const doc = await this.getDocumentById.execute(id, req.user.userId);

    return {
      id: doc.id,
      filename: doc.filename,
      mimetype: doc.mimetype,
      size: doc.size,
      storagePath: doc.storagePath,
      createdAt: doc.createdAt,
      status: doc.status,
      userId: doc.userId?.toString(),
      text: doc.text,
    };
  }


  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un documento por ID' })
  @ApiResponse({ status: 204, description: 'Documento eliminado' })
  async deleteDocument(@Param('id') id: string, @Req() req: any): Promise<void> {
    await this.deleteDocumentUseCase.execute(id, req.user.userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Lista todos los documentos del usuario autenticado' })
  @ApiResponse({ status: 200, type: DocumentResponseDto, isArray: true })
  async listDocuments(@Req() req: any): Promise<DocumentResponseDto[]> {
    const docs = await this.listDocumentsUseCase.execute(req.user.userId);

    return docs.map(doc => ({
      id: doc.id,
      filename: doc.filename,
      mimetype: doc.mimetype,
      size: doc.size,
      storagePath: doc.storagePath,
      createdAt: doc.createdAt,
      status: doc.status,
      userId: doc.user?.id,
      text: doc.text,
    }));
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('analyze-text')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'static', 'uploads'),
        filename: (_req, file, cb) => {
          const unique = randomUUID();
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async analyzeGeneric(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('El archivo es requerido');
    }

    return await this.analyzeGenericTextUseCase.execute(file.path);
  }
}