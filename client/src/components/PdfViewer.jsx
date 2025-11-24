import React from 'react';

export default function PdfViewer({ pdf }) {
  if (!pdf) {
    return <div style={{ padding: '20px' }}>Select a PDF to preview.</div>;
  }

  return (
    <iframe title={pdf.title} src={pdf.url} allow="fullscreen" loading="lazy" />
  );
}
