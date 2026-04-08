/*
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { fromPath } from 'pdf2pic';
import { TextExtractorPort } from 'src/Domain/documents/text-extractor.port';

// PDF.js LEGACY (compatible con Node)
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.js');

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Injectable()
export class TextExtractorAdapter implements TextExtractorPort {
  private readonly logger = new Logger(TextExtractorAdapter.name);

  // ============================================================
  // ENTRYPOINT
  // ============================================================
  async extractText(filePath: string): Promise<string> {
    try {
      const ext = path.extname(filePath).toLowerCase();

      switch (ext) {
        case '.pdf':
          return await this.extractFromPdf(filePath);

        case '.docx':
          return await this.extractFromDocx(filePath);

        case '.txt':
          return await this.extractFromTxt(filePath);

        default:
          this.logger.warn(`Formato no soportado: ${ext}`);
          return '';
      }
    } catch (error) {
      this.logger.error('Error inesperado en extractText()', error);
      return '';
    }
  }

  // ============================================================
  // PDF
  // ============================================================
  private async extractFromPdf(filePath: string): Promise<string> {
    try {
      const buffer = new Uint8Array(await fs.readFile(filePath));
      const { text, images } = await this.parsePdf(buffer);

      // 1) Si hay texto nativo → usarlo
      if (text && text.trim()) {
        return this.clean(text);
      }

      // 2) Si no hay imágenes → intentar fallback Poppler
      if (!images || images.length === 0) {
        this.logger.warn('PDF sin texto ni imágenes. Intentando fallback OCR...');

        const fallbackText = await this.fallbackPdfToImageOCR(filePath);

        if (fallbackText.trim().length > 0) {
          this.logger.log('Fallback OCR exitoso.');
          return this.clean(fallbackText);
        }

        this.logger.warn('Fallback OCR falló. Devolviendo vacío.');
        return '';
      }

      // 3) OCR seguro sobre imágenes internas
      const ocrText = await this.extractWithOCRFromImages(images);
      return this.clean(ocrText);

    } catch (error) {
      this.logger.error('Error inesperado en extractFromPdf()', error);
      return '';
    }
  }

  private async parsePdf(buffer: Uint8Array): Promise<{ text: string; images: Buffer[] }> {
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    const images: Buffer[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);

        // TEXTO
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';

        // IMÁGENES
        const ops = await page.getOperatorList();
        const objs = page.objs;

        for (let i = 0; i < ops.fnArray.length; i++) {
          if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
            const imgName = ops.argsArray[i][0];
            const img = await objs.get(imgName);

            if (img?.data) {
              const buf = Buffer.from(img.data);

              if (this.validateImage(buf)) {
                images.push(buf);
              } else {
                this.logger.warn(`Imagen inválida detectada en página ${pageNum}`);
              }
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error procesando página ${pageNum}`, error);
      }
    }

    return { text: fullText, images };
  }

  // ============================================================
  // FALLBACK: PDF → PNG → OCR (Poppler)
  // ============================================================
  private async fallbackPdfToImageOCR(filePath: string): Promise<string> {
    try {
      const converter = fromPath(filePath, {
        density: 200,
        saveFilename: 'page',
        savePath: '/tmp/pdf-ocr',
        format: 'png',
        width: 1200,
        height: 1600,
      });

      let finalText = '';
      let pageNumber = 1;

      while (true) {
        try {
          // Intentamos convertir la página N
          const page = await converter(pageNumber, { responseType: "buffer" });

          // Si no hay buffer → no existe la página → cortar
          if (!page || !page.buffer || page.buffer.length < 1000) {
            this.logger.warn(`Fallback OCR: fin de páginas en ${pageNumber}`);
            break;
          }

          // OCR solo si la imagen es válida
          const text = await this.extractWithOCR(page.buffer);

          if (text.trim().length > 0) {
            finalText += text + '\n';
          }

          pageNumber++;

        } catch (err) {
          // pdf2pic lanza error cuando ya no hay más páginas
          this.logger.warn(`Fallback OCR: no hay más páginas (page ${pageNumber})`);
          break;
        }
      }

      return finalText.trim();

    } catch (error) {
      this.logger.error('Fallback OCR falló', error);
      return '';
    }
  }

  // ============================================================
  // OCR BLINDADO
  // ============================================================
  private validateImage(buffer: Buffer): boolean {
    if (!buffer || buffer.length < 1000) return false;

    const header = buffer.slice(0, 4).toString('hex');

    const isPng = header === '89504e47';
    const isJpeg = header.startsWith('ffd8');

    return isPng || isJpeg;
  }

  private async extractWithOCR(imageBuffer: Buffer): Promise<string> {
    if (!this.validateImage(imageBuffer)) {
      this.logger.warn('Imagen inválida antes de OCR. Saltando.');
      return '';
    }

    try {
      const { data } = await Tesseract.recognize(imageBuffer, 'spa', {
        logger: m => this.logger.debug(`OCR: ${m.status} - ${m.progress}`)
      });

      return data.text ?? '';
    } catch (error) {
      this.logger.error('OCR falló dentro del worker, devolviendo vacío', error);
      return '';
    }
  }

  private async extractWithOCRFromImages(images: Buffer[]): Promise<string> {
    let finalText = '';

    for (const img of images) {
      try {
        const text = await this.extractWithOCR(img);
        if (text.trim().length > 0) {
          finalText += text + '\n';
        }
      } catch (error) {
        this.logger.error('Error inesperado en OCR de imagen', error);
      }
    }

    return finalText.trim();
  }

  // ============================================================
  // DOCX / TXT
  // ============================================================
  private async extractFromDocx(filePath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return this.clean(result.value || '');
    } catch (error) {
      this.logger.error('Error extrayendo DOCX', error);
      return '';
    }
  }

  private async extractFromTxt(filePath: string): Promise<string> {
    try {
      const text = await fs.readFile(filePath, 'utf8');
      return this.clean(text);
    } catch (error) {
      this.logger.error('Error leyendo TXT', error);
      return '';
    }
  }

  // ============================================================
  // LIMPIEZA PROFUNDA
  // ============================================================
  private clean(text: string): string {
    if (!text) return '';

    return text
      .replace(/\r/g, '')
      .replace(/[^\x20-\x7E\náéíóúÁÉÍÓÚñÑ]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[|#]{3,}/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
}
*/


import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { fromPath } from 'pdf2pic';
import { TextExtractorPort } from 'src/Domain/documents/text-extractor.port';

// PDF.js LEGACY (compatible con Node)
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.js');

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Injectable()
export class TextExtractorAdapter implements TextExtractorPort {
  private readonly logger = new Logger(TextExtractorAdapter.name);

  // ============================================================
  // ENTRYPOINT
  // ============================================================
  async extractText(filePath: string): Promise<string> {
    try {
      const ext = path.extname(filePath).toLowerCase();

      switch (ext) {
        case '.pdf':
          return await this.extractFromPdf(filePath);

        case '.docx':
          return await this.extractFromDocx(filePath);

        case '.txt':
          return await this.extractFromTxt(filePath);

        case '.png':
        case '.jpg':
        case '.jpeg':
          return await this.extractFromImage(filePath);

        default:
          this.logger.warn(`Formato no soportado: ${ext}`);
          return '';
      }
    } catch (error) {
      this.logger.error('Error inesperado en extractText()', error);
      return '';
    }
  }

  // ============================================================
  // PDF
  // ============================================================
  private async extractFromPdf(filePath: string): Promise<string> {
    try {
      const buffer = new Uint8Array(await fs.readFile(filePath));
      const { text, images } = await this.parsePdf(buffer);

      // 1) Si hay texto nativo → usarlo
      if (text && text.trim()) {
        return this.clean(text);
      }

      // 2) Si no hay imágenes → intentar fallback Poppler
      if (!images || images.length === 0) {
        this.logger.warn('PDF sin texto ni imágenes. Intentando fallback OCR...');

        const fallbackText = await this.fallbackPdfToImageOCR(filePath);

        if (fallbackText.trim().length > 0) {
          this.logger.log('Fallback OCR exitoso.');
          return this.clean(fallbackText);
        }

        this.logger.warn('Fallback OCR falló. Devolviendo vacío.');
        return '';
      }

      // 3) OCR seguro sobre imágenes internas
      const ocrText = await this.extractWithOCRFromImages(images);
      return this.clean(ocrText);

    } catch (error) {
      this.logger.error('Error inesperado en extractFromPdf()', error);
      return '';
    }
  }

  private async parsePdf(buffer: Uint8Array): Promise<{ text: string; images: Buffer[] }> {
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    const images: Buffer[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);

        // TEXTO
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';

        // IMÁGENES
        const ops = await page.getOperatorList();
        const objs = page.objs;

        for (let i = 0; i < ops.fnArray.length; i++) {
          if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
            const imgName = ops.argsArray[i][0];
            const img = await objs.get(imgName);

            if (img?.data) {
              const buf = Buffer.from(img.data);

              if (this.validateImage(buf)) {
                images.push(buf);
              } else {
                this.logger.warn(`Imagen inválida detectada en página ${pageNum}`);
              }
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error procesando página ${pageNum}`, error);
      }
    }

    return { text: fullText, images };
  }

  // ============================================================
  // FALLBACK: PDF → PNG → OCR (Poppler multipágina)
  // ============================================================
  private async fallbackPdfToImageOCR(filePath: string): Promise<string> {
    try {
      const converter = fromPath(filePath, {
        density: 200,
        saveFilename: 'page',
        savePath: '/tmp/pdf-ocr',
        format: 'png',
        width: 1200,
        height: 1600,
      });

      let finalText = '';
      let pageNumber = 1;

      while (true) {
        try {
          const page = await converter(pageNumber, { responseType: "buffer" });

          if (!page || !page.buffer || page.buffer.length < 1000) {
            this.logger.warn(`Fallback OCR: fin de páginas en ${pageNumber}`);
            break;
          }

          const text = await this.extractWithOCR(page.buffer);

          if (text.trim().length > 0) {
            finalText += text + '\n';
          }

          pageNumber++;

        } catch (err) {
          this.logger.warn(`Fallback OCR: no hay más páginas (page ${pageNumber})`);
          break;
        }
      }

      return finalText.trim();

    } catch (error) {
      this.logger.error('Fallback OCR falló', error);
      return '';
    }
  }

  // ============================================================
  // IMÁGENES PNG/JPG/JPEG
  // ============================================================
  private async extractFromImage(filePath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filePath);

      const text = await this.extractWithOCR(buffer);

      if (!text || text.trim().length === 0) {
        this.logger.warn('OCR no pudo extraer texto de la imagen.');
        return '';
      }

      return this.clean(text);

    } catch (error) {
      this.logger.error('Error extrayendo texto de imagen', error);
      return '';
    }
  }

  // ============================================================
  // OCR BLINDADO
  // ============================================================
  private validateImage(buffer: Buffer): boolean {
    if (!buffer || buffer.length < 1000) return false;

    const header = buffer.slice(0, 4).toString('hex');

    const isPng = header === '89504e47';
    const isJpeg = header.startsWith('ffd8');

    return isPng || isJpeg;
  }

  private async extractWithOCR(imageBuffer: Buffer): Promise<string> {
    if (!this.validateImage(imageBuffer)) {
      this.logger.warn('Imagen inválida antes de OCR. Saltando.');
      return '';
    }

    try {
      const { data } = await Tesseract.recognize(imageBuffer, 'spa', {
        logger: m => this.logger.debug(`OCR: ${m.status} - ${m.progress}`)
      });

      return data.text ?? '';
    } catch (error) {
      this.logger.error('OCR falló dentro del worker, devolviendo vacío', error);
      return '';
    }
  }

  private async extractWithOCRFromImages(images: Buffer[]): Promise<string> {
    let finalText = '';

    for (const img of images) {
      try {
        const text = await this.extractWithOCR(img);
        if (text.trim().length > 0) {
          finalText += text + '\n';
        }
      } catch (error) {
        this.logger.error('Error inesperado en OCR de imagen', error);
      }
    }

    return finalText.trim();
  }

  // ============================================================
  // DOCX / TXT
  // ============================================================
  private async extractFromDocx(filePath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return this.clean(result.value || '');
    } catch (error) {
      this.logger.error('Error extrayendo DOCX', error);
      return '';
    }
  }

  private async extractFromTxt(filePath: string): Promise<string> {
    try {
      const text = await fs.readFile(filePath, 'utf8');
      return this.clean(text);
    } catch (error) {
      this.logger.error('Error leyendo TXT', error);
      return '';
    }
  }

  // ============================================================
  // LIMPIEZA PROFUNDA
  // ============================================================
  private clean(text: string): string {
    if (!text) return '';

    return text
      .replace(/\r/g, '')
      .replace(/[^\x20-\x7E\náéíóúÁÉÍÓÚñÑ]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[|#]{3,}/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
}

