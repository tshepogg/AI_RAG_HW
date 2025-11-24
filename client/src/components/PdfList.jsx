import React from 'react';

export default function PdfList({ pdfs, selectedIndex, onSelect, onAsk }) {
  return (
    <div className="pdf-list">
      {pdfs.map((pdf, idx) => (
        <div
          key={pdf.title}
          className="pdf-item"
          style={{ border: idx === selectedIndex ? '1px solid #38bdf8' : '1px solid transparent' }}
        >
          <div>
            <strong>{pdf.title}</strong>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary" onClick={() => onSelect(idx)}>
              Open PDF
            </button>
            <button onClick={() => onAsk(pdf.title)}>Ask about this PDF</button>
          </div>
        </div>
      ))}
      {pdfs.length === 0 && <p>No PDFs found. Add entries to server/pdfList.json.</p>}
    </div>
  );
}
