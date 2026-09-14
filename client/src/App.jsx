import React, { useEffect, useState, useRef } from 'react';
import TextInput from './components/TextInput';
import VoiceControls from './components/VoiceControls';
import AudioPlayer from './components/AudioPlayer';
import ErrorMessage from './components/ErrorMessage';

import {
  checkBackendHealth,
  generateSpeech,
  getVoices,
} from './services/api';

import './App.css';

export default function App() {
  const [text, setText] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('af_heart');
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const [previewingVoice, setPreviewingVoice] = useState('');

  const previewAudioRef = useRef(null);

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

  useEffect(() => {
    getVoices()
      .then((data) => {
        setVoices(data.voices);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    const matchingVoices = voices.filter(
      (voice) => voice.language === selectedLang
    );

    const currentVoiceIsValid = matchingVoices.some(
      (voice) => voice.id === selectedVoice
    );

    if (!currentVoiceIsValid && matchingVoices.length > 0) {
      setSelectedVoice(matchingVoices[0].id);
    }
  }, [selectedLang, voices, selectedVoice]);

  const languageNames = {
    'en-US': 'English (United States)',
    'en-GB': 'English (United Kingdom)',
    'es-ES': 'Spanish (Spain)',
    'fr-FR': 'French',
    'hi-IN': 'Hindi (India)',
    'it-IT': 'Italian',
    'ja-JP': 'Japanese',
    'pt-BR': 'Portuguese (Brazil)',
    'zh-CN': 'Chinese',
  };

  const languages = [
    ...new Set(voices.map((voice) => voice.language)),
  ].map((code) => ({
    code,
    name: languageNames[code] || code,
  }));

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

    generateSpeech(text, selectedVoice)
      .then((url) => {
        setAudioUrl(url);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClear = () => {
    setText('');
    setAudioUrl('');
    setError('');
  };

  const handlePreviewVoice = (voiceId) => {
    if (previewingVoice) return;
    setError('');
    setPreviewingVoice(voiceId);

    generateSpeech('Hello, this is a quick preview of this voice.', voiceId)
      .then((url) => {
        const audio = new Audio(url);
        previewAudioRef.current = audio;
        audio.onended = () => setPreviewingVoice('');
        audio.onerror = () => setPreviewingVoice('');
        audio.play();
      })
      .catch((error) => {
        setError(error.message);
        setPreviewingVoice('');
      });
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

        <div className="nav-right">
          <div className="live-status-pill">
            <div className="pulse-core"></div>
            Engine Active
          </div>

          <div className="nav-divider"></div>

          <div className="nav-meta">
            <span className="nav-meta-title">Natural Voices</span>
            <span className="nav-meta-sub">Powered by Kokoro (OpenRouter)</span>
          </div>

          <div className="nav-eq">
            <span></span><span></span><span></span><span></span>
          </div>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Clear
            </button>
          </div>
        </section>

        <aside className="settings-panel">
          <div className="panel-header-row" style={{ marginBottom: '4px' }}>
            <span className="panel-title">Voice Settings</span>
          </div>

          <VoiceControls
            languages={languages}
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
            voices={voices}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            previewingVoice={previewingVoice}
            onPreviewVoice={handlePreviewVoice}
          />
        </aside>
      </div>

      <AudioPlayer audioUrl={audioUrl} isLoading={isLoading} />
    </div>
  );
}