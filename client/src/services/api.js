import axios from 'axios';

// Use VITE_API_BASE when deployed; empty string defaults to same origin (dev proxy handles local).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
});

export async function fetchPdfs() {
  const { data } = await api.get('/pdfs');
  return data;
}

export async function askQuestion(question, pdfTitle = 'All') {
  const { data } = await api.post('/ask', { question, pdfTitle });
  return data;
}
