import { randomUUID } from 'crypto';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

import { UploadDocumentUseCase } from '../../../Domain/documents/upload-document-use.case';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly uploadDocument: UploadDocumentUseCase) {}

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
        userId: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentDto,
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
      userId: body.userId,
    });

    return {
      id: document.id,
      filename: document.filename,
      mimetype: document.mimetype,
      size: document.size,
      storagePath: document.storagePath,
      createdAt: document.createdAt,
      userId: document.userId,
      text: document.text,
    };
  }
}