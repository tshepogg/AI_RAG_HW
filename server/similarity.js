/**
 * Compute cosine similarity between two vectors.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
export function cosineSimilarity(a, b) {
  if (a.length !== b.length) throw new Error('Vectors must be same length');
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Sort candidates by similarity to query embedding.
 * @param {{embedding:number[], text:string, pdfTitle:string, pdfUrl:string, chunkId:string}[]} candidates
 * @param {number[]} queryEmbedding
 * @param {number} topK
 */
export function rankBySimilarity(candidates, queryEmbedding, topK = 5) {
  const scored = candidates.map((item) => ({
    ...item,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
