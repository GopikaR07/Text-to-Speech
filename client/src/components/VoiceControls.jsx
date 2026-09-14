import React, { useEffect, useState } from 'react';

const VISIBLE_COUNT = 6;

export default function VoiceControls({
  languages,
  selectedLang,
  setSelectedLang,
  voices,
  selectedVoice,
  setSelectedVoice,
  previewingVoice,
  onPreviewVoice,
}) {
  const [showAll, setShowAll] = useState(false);

  const matchingVoices = voices.filter((v) => v.language === selectedLang);
  const visibleVoices = showAll
    ? matchingVoices
    : matchingVoices.slice(0, VISIBLE_COUNT);

  useEffect(() => {
    setShowAll(false);
  }, [selectedLang]);

  return (
    <>
      <div className="setting-group">
        <span className="input-label">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
          </svg>
          Language
        </span>
        <div className="select-wrapper">
          <select
            className="studio-select"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <svg className="select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>

      <div className="setting-group">
        <div className="voice-models-header">
          <span className="input-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h2l2-7 4 14 3-10 2 6h5"/>
            </svg>
            Voice Models ({matchingVoices.length})
          </span>
          {matchingVoices.length > VISIBLE_COUNT && (
            <button className="show-all-link" onClick={() => setShowAll((s) => !s)}>
              {showAll ? 'Show less' : 'Show all voices'}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
          )}
        </div>

        <div className="voice-cards-grid">
          {visibleVoices.map((v) => {
            const isSelected = selectedVoice === v.id;
            const isPreviewing = previewingVoice === v.id;
            return (
              <div
                key={v.id}
                className={`voice-card-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedVoice(v.id)}
              >
                <div className="voice-info">
                  <span className="voice-name-text">{v.name}</span>
                  <span className="voice-detail-text">Neural Studio Voice</span>
                </div>
                <div className="voice-card-footer">
                  <span className="gender-tag">{v.gender}</span>
                  <button
                    type="button"
                    className={`voice-preview-btn ${isPreviewing ? 'previewing' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewVoice(v.id);
                    }}
                    aria-label={`Preview ${v.name}`}
                  >
                    {isPreviewing ? (
                      <span className="preview-spinner"></span>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 5v14l12-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}