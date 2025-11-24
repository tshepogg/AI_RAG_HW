import dotenv from 'dotenv';
import fs from 'fs/promises';
import OpenAI from 'openai';
import { rankBySimilarity } from './similarity.js';

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VECTOR_STORE_PATH = process.env.VECTOR_STORE_PATH || './vectorstore.json';
const COMPLETION_MODEL = 'gpt-4o-mini';

async function loadVectorStore() {
  const raw = await fs.readFile(VECTOR_STORE_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Create an answer using OpenAI with retrieved context.
 * @param {string} question
 * @param {Array} candidates
 */
async function generateAnswer(question, candidates) {
  const context = candidates
    .map((c, idx) => `Source ${idx + 1} (${c.pdfTitle}):\n${c.text}`)
    .join('\n\n');

  const messages = [
    {
      role: 'system',
      content:
        'You are a helpful assistant answering questions about Botswana newspapers. Use the provided context to answer concisely and cite which source number(s) you used. If unsure, say you do not know.',
    },
    {
      role: 'user',
      content: `Context:\n${context}\n\nQuestion: ${question}\nReturn a helpful answer and mention source numbers.`,
    },
  ];

  const response = await client.chat.completions.create({
    model: COMPLETION_MODEL,
    messages,
    temperature: 0.2,
  });

  const answer = response.choices?.[0]?.message?.content || 'No answer generated.';
  return answer;
}

/**
 * Handle a user question against vector store.
 * @param {string} question
 * @param {string} pdfTitle
 */
export async function answerQuestion(question, pdfTitle = 'All') {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required to answer questions');
  }
  const store = await loadVectorStore();
  const filtered = pdfTitle === 'All' ? store : store.filter((c) => c.pdfTitle === pdfTitle);
  if (filtered.length === 0) {
    return { answer: 'No content available for that selection.', sources: [] };
  }

  // Embed the question
  const embedResponse = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: [question],
  });
  const questionEmbedding = embedResponse.data[0].embedding;

  const ranked = rankBySimilarity(filtered, questionEmbedding, 5);
  const answer = await generateAnswer(question, ranked);
  const sources = ranked.map((r) => ({ pdfTitle: r.pdfTitle, chunkText: r.text, pdfUrl: r.pdfUrl }));

  return { answer, sources };
}
