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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPdfs()
      .then((list) => {
        setPdfs(list);
        if (list.length > 0) {
          setSelectedPdfIndex(0);
        }
      })
      .catch((err) => setError(err.message));
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
              placeholder="Ask a question about the Botswana newspapers..."
            />
            <select value={searchScope} onChange={(e) => setSearchScope(e.target.value)}>
              <option value="All">All PDFs</option>
              {pdfs.map((pdf) => (
                <option key={pdf.title} value={pdf.title}>
                  {pdf.title}
                </option>
              ))}
            </select>
            <button onClick={() => handleAsk()}>Ask</button>
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
