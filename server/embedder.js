import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const EMBEDDING_MODEL = 'text-embedding-3-small';

/**
 * Generate embeddings for an array of text chunks.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export async function embedTexts(texts) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required to generate embeddings');
  }

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return response.data.map((item) => item.embedding);
}

export { EMBEDDING_MODEL };
