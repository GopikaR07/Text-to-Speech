import React from 'react';

export default function VoiceControls({
  languages,
  selectedLang,
  setSelectedLang,
  voices,
  selectedVoice,
  setSelectedVoice,
}) {
  return (
    <>
      <div className="setting-group">
        <span className="panel-title">Language Region</span>
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
      </div>

      <div className="setting-group">
        <span className="panel-title">Voice Models</span>
        <div className="voice-cards-stack">
          {voices.map((v) => {
            const isSelected = selectedVoice === v.id;
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
                <span className="gender-tag">{v.gender}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}