/**
 * Chunk long text into overlapping segments.
 * @param {string} text
 * @param {number} chunkSize
 * @param {number} overlap
 * @returns {string[]}
 */
export function chunkText(text, chunkSize = 500, overlap = 100) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    start += chunkSize - overlap;
  }
  return chunks;
}
