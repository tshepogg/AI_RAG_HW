import fs from 'fs/promises';
import dotenv from 'dotenv';
import { downloadPdf } from './pdfLoader.js';
import { extractTextFromPdf } from './pdfParser.js';
import { chunkText } from './chunker.js';
import { embedTexts } from './embedder.js';

dotenv.config();

const VECTOR_STORE_PATH = process.env.VECTOR_STORE_PATH || './vectorstore.json';
const PDF_LIST_PATH = process.env.PDF_LIST_PATH || './pdfList.json';

async function readPdfList() {
  const raw = await fs.readFile(PDF_LIST_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function persistVectorStore(records) {
  await fs.writeFile(VECTOR_STORE_PATH, JSON.stringify(records, null, 2));
}

/**
 * Process PDFs on startup: download, parse, chunk, embed, and persist.
 */
export async function buildVectorStore() {
  console.log('Loading PDF list...');
  const pdfList = await readPdfList();
  const vectorRecords = [];

  for (const pdf of pdfList) {
    try {
      console.log(`Processing ${pdf.title}...`);
      const pdfBuffer = await downloadPdf(pdf.url);
      const text = await extractTextFromPdf(pdfBuffer);
      const chunks = chunkText(text);
      const embeddings = await embedTexts(chunks);

      chunks.forEach((chunk, idx) => {
        vectorRecords.push({
          pdfTitle: pdf.title,
          pdfUrl: pdf.url,
          chunkId: `${pdf.title.replace(/\s+/g, '_')}_${idx}`,
          text: chunk,
          embedding: embeddings[idx],
        });
      });
      console.log(`Added ${chunks.length} chunks for ${pdf.title}`);
    } catch (err) {
      console.error(`Failed to process ${pdf.title}:`, err.message);
    }
  }

  await persistVectorStore(vectorRecords);
  console.log(`Vector store saved to ${VECTOR_STORE_PATH} with ${vectorRecords.length} chunks.`);
  return { pdfList, vectorStore: vectorRecords };
}
