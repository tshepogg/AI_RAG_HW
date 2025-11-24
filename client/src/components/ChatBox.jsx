import React from 'react';

export default function ChatBox({ answer, sources = [], loading }) {
  return (
    <div className="chat-box">
      <h3>AI Response</h3>
      {loading ? <p>Thinking...</p> : <p>{answer || 'Ask a question to see the answer here.'}</p>}
      {sources.length > 0 && (
        <div className="sources">
          <strong>Sources</strong>
          {sources.map((src, idx) => (
            <div key={idx} className="source-chip">
              <div style={{ fontWeight: 700 }}>{src.pdfTitle}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{src.chunkText}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
