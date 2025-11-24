import pdf from 'pdf-parse';

/**
 * Extract plain text from a PDF Buffer.
 * @param {Buffer} pdfBuffer
 * @returns {Promise<string>}
 */
export async function extractTextFromPdf(pdfBuffer) {
  const data = await pdf(pdfBuffer);
  return data.text || '';
}
