import React from 'react';

export default function TextInput({ text, setText, maxChars = 500 }) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <>
      <div className="panel-header-row">
        <span className="panel-title">Script Workspace</span>
        <span className="char-total-label">{charCount} / {maxChars}</span>
      </div>

      <div className="editor-wrapper">
        <textarea
          className="studio-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text script here..."
          maxLength={maxChars}
        />

        <div className="editor-footer-metrics">
          <div className="metric-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
            {wordCount} words
          </div>
          <div className="metric-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            {charCount} characters
          </div>
        </div>
      </div>
    </>
  );
}