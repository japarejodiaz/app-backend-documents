export interface TextExtractorPort {
  extractText(filePath: string): Promise<string>;
}