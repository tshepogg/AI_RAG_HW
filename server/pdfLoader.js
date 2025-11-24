import fs from 'fs/promises';

/**
 * Download a PDF from a remote URL and return a Buffer.
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
export async function downloadPdf(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Optionally cache PDF to disk for debugging.
 */
export async function savePdfToDisk(buffer, filePath) {
  await fs.writeFile(filePath, buffer);
}
