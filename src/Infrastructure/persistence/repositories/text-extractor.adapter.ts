import { Injectable } from '@nestjs/common';

import * as fs from 'fs/promises';
import * as path from 'path';
import pdfParse from './pdf-parse-wrapper';
import mammoth from 'mammoth';
import { TextExtractorPort } from 'src/Domain/documents/text-extractor.port';

@Injectable()
export class TextExtractorAdapter implements TextExtractorPort {

  async extractText(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case '.pdf':
        return this.extractFromPdf(filePath);

      case '.docx':
        return this.extractFromDocx(filePath);

      case '.txt':
        return this.extractFromTxt(filePath);

      default:
        throw new Error(`Formato no soportado: ${ext}`);
    }
  }

  private async extractFromPdf(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer, {});
    return data.text || '';
  }

  private async extractFromDocx(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }

  private async extractFromTxt(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf8');
  }
}