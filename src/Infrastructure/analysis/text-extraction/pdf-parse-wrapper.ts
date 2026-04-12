// Cargamos pdf-parse como CommonJS
import pdfParseCjs from 'pdf-parse';
// Convertimos a unknown y luego a función
const pdfParse = pdfParseCjs as unknown as (
  buffer: Buffer,
  options?: any
) => Promise<any>;

export default pdfParse;
