import React, { useEffect, useMemo, useState } from 'react';
import PdfList from './components/PdfList.jsx';
import PdfViewer from './components/PdfViewer.jsx';
import ChatBox from './components/ChatBox.jsx';
import { fetchPdfs, askQuestion } from './services/api.js';

export default function App() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdfIndex, setSelectedPdfIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [searchScope, setSearchScope] = useState('All');
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPdfs = async () => {
      try {
        const list = await fetchPdfs();
        setPdfs(list);
        if (list.length > 0) {
          setSelectedPdfIndex(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setPdfLoading(false);
      }
    };

    loadPdfs();
  }, []);

  const selectedPdf = useMemo(() => pdfs[selectedPdfIndex] || null, [pdfs, selectedPdfIndex]);

  const handleAsk = async (pdfTitleParam) => {
    if (!question) return;
    setLoading(true);
    setError('');
    setAnswer('');
    setLastQuestion(question);
    try {
      const scope = pdfTitleParam || searchScope || 'All';
      const result = await askQuestion(question, scope);
      setAnswer(result.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPdf = (index) => {
    setSelectedPdfIndex(index);
    setSearchScope('All');
  };

  if (pdfLoading) {
    return (
      <div className="page-loading">
        <div className="loading-card">
          <h1>Botswana Newspaper AI</h1>
          <p>Loading the archived PDFs from the backend. You can start asking questions once the library is ready.</p>
          <div className="loading-state" role="status" aria-label="Loading PDFs">
            <div className="spinner" />
            <span>Preparing your documents...</span>
          </div>
          {error && <div className="error-text">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1>Botswana Newspaper AI Search</h1>
        <p>Browse PDFs and ask targeted questions.</p>
        <PdfList
          pdfs={pdfs}
          selectedIndex={selectedPdfIndex}
          onSelect={handleSelectPdf}
          onAsk={(pdfTitle) => {
            setSearchScope(pdfTitle);
            handleAsk(pdfTitle);
          }}
        />
      </aside>
      <main className="main-panel">
        <div className="controls">
          <div className="question-form">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={pdfs.length === 0 ? 'No PDFs available yet.' : 'Ask about the Botswana newspapers...'}
              disabled={pdfs.length === 0}
            />
            <select value={searchScope} onChange={(e) => setSearchScope(e.target.value)} disabled={pdfs.length === 0}>
              <option value="All">All PDFs</option>
              {pdfs.map((pdf) => (
                <option key={pdf.title} value={pdf.title}>
                  {pdf.title}
                </option>
              ))}
            </select>
            <button onClick={() => handleAsk()} disabled={pdfs.length === 0}>
              Ask
            </button>
          </div>
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
          <ChatBox answer={answer} question={lastQuestion} loading={loading} />
        </div>
        <div className="viewer">
          <PdfViewer pdf={selectedPdf} />
        </div>
      </main>
    </div>
  );
}
