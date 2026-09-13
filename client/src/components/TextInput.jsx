import React from 'react';

export default function TextInput({ text, setText, maxChars = 500 }) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const progressPercent = Math.min((charCount / maxChars) * 100, 100);

  return (
    <>
      <div className="panel-header-row">
        <span className="panel-title">Script Workspace</span>
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
          <div className="word-badge">{wordCount} Words</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="22" height="22" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="4.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={progressPercent > 90 ? '#ef4444' : '#6366f1'}
                strokeWidth="4.5"
                strokeDasharray={`${progressPercent}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span style={{ fontWeight: 500 }}>{charCount} / {maxChars}</span>
          </div>
        </div>
      </div>
    </>
  );
}