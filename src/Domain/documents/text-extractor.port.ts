export const TextExtractorPortToken = Symbol('TextExtractorPort');

export interface TextExtractorPort {
  extractText(filePath: string): Promise<string>;
}