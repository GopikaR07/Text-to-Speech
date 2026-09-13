import React, { useEffect, useState } from 'react';
import TextInput from './components/TextInput';
import VoiceControls from './components/VoiceControls';
import AudioPlayer from './components/AudioPlayer';
import ErrorMessage from './components/ErrorMessage';

import { checkBackendHealth } from './services/api';
import './App.css';

export default function App() {
  const [text, setText] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('en-US-Female');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');

  const MAX_TEXT_LENGTH = 500;

  useEffect(() => {
  checkBackendHealth()
    .then((data) => {
      console.log('Backend:', data.message);
    })
    .catch((error) => {
      console.error('Backend connection failed:', error);
    });
}, []);

  const mockLanguages = [
    { code: 'en-US', name: 'English (United States)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
  ];

  const mockVoices = [
    { id: 'en-US-Female', name: 'Ava (Neural)', gender: 'Female' },
    { id: 'en-US-Male', name: 'Ethan (Neural)', gender: 'Male' },
  ];

  const handleGenerate = () => {
    setError('');
    setAudioUrl('');

    if (!text.trim()) {
      setError('Please enter some text before generating speech.');
      return;
    }
    if (text.length > MAX_TEXT_LENGTH) {
      setError(`Text exceeds maximum allowed limit of ${MAX_TEXT_LENGTH} characters.`);
      return;
    }
    if (!selectedLang || !selectedVoice) {
      setError('Please select both a valid language and voice.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAudioUrl('https://www.w3schools.com/html/horse.mp3');
    }, 1200);
  };

  const handleClear = () => {
    setText('');
    setAudioUrl('');
    setError('');
  };

  return (
    <div className="dashboard-root">
      {/* Ambient background */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-grid"></div>

      {/* Top Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" fill="white"/>
              <path d="M19 10v1a7 7 0 01-14 0v-1M12 18v3M9 21h6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="brand-text">
            <h1>VoiceStudio AI</h1>
            <span className="brand-sub">Neural Text-to-Speech</span>
          </div>
        </div>
        <div className="live-status-pill">
          <div className="pulse-core"></div>
          Engine Active
        </div>
      </nav>

      <ErrorMessage message={error} />

      {/* Main Two-Column Workspace */}
      <div className="workspace-grid">
        <section className="editor-panel">
          <TextInput
            text={text}
            setText={(val) => {
              setText(val);
              if (error) setError('');
            }}
            maxChars={MAX_TEXT_LENGTH}
          />

          <div className="workspace-actions">
            <button
              className="btn-synthesize-action"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  Synthesizing...
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor"/>
                  </svg>
                  Generate Speech
                </>
              )}
            </button>
            <button className="btn-clear-action" onClick={handleClear}>
              Clear
            </button>
          </div>
        </section>

        <aside className="settings-panel">
          <div className="panel-header-row" style={{ marginBottom: '4px' }}>
            <span className="panel-title">Voice Settings</span>
          </div>

          <VoiceControls
            languages={mockLanguages}
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
            voices={mockVoices}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />
        </aside>
      </div>

      <AudioPlayer audioUrl={audioUrl} isLoading={isLoading} />
    </div>
  );
}