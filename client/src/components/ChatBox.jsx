import React from 'react';

export default function ChatBox({ question, answer, loading }) {
  const hasConversation = question || answer;

  return (
    <div className="chat-box">
      <div className="chat-header">
        <div className="avatar">AI</div>
        <div>
          <div className="title">Newspaper Research Assistant</div>
          <div className="subtitle">Ask anything about the uploaded PDFs.</div>
        </div>
      </div>

      <div className="chat-thread">
        {!hasConversation ? (
          <p className="placeholder">Start the conversation by asking a question.</p>
        ) : (
          <>
            {question && (
              <div className="chat-bubble user">
                <span className="label">You</span>
                <p>{question}</p>
              </div>
            )}

            <div className="chat-bubble ai">
              <span className="label">Assistant</span>
              {loading ? (
                <div className="loading-state" role="status" aria-label="Loading response">
                  <div className="spinner" />
                  <span>Searching the archives...</span>
                </div>
              ) : (
                <p>{answer || 'Ask a question to see the answer here.'}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
