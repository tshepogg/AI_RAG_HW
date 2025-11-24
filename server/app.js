import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import { buildVectorStore } from './startup.js';
import { answerQuestion } from './ragEngine.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3000;
const VECTOR_STORE_PATH = process.env.VECTOR_STORE_PATH || './vectorstore.json';
const PDF_LIST_PATH = process.env.PDF_LIST_PATH || './pdfList.json';

let pdfListCache = [];

// Startup pipeline
(async () => {
  try {
    const { pdfList } = await buildVectorStore();
    pdfListCache = pdfList;
  } catch (err) {
    console.error('Startup pipeline failed:', err.message);
  }
})();

app.get('/pdfs', async (_req, res) => {
  try {
    if (pdfListCache.length === 0) {
      const raw = await fs.readFile(PDF_LIST_PATH, 'utf-8');
      pdfListCache = JSON.parse(raw);
    }
    res.json(pdfListCache);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/view/:index', async (req, res) => {
  const idx = Number(req.params.index);
  if (Number.isNaN(idx)) {
    return res.status(400).json({ error: 'Invalid index' });
  }
  try {
    const pdfs = pdfListCache.length
      ? pdfListCache
      : JSON.parse(await fs.readFile(PDF_LIST_PATH, 'utf-8'));
    if (idx < 0 || idx >= pdfs.length) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    res.redirect(pdfs[idx].url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/ask', async (req, res) => {
  const { question, pdfTitle = 'All' } = req.body || {};
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
  try {
    const result = await answerQuestion(question, pdfTitle);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (_req, res) => {
  res.send('Botswana Newspaper AI Search backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
