import React, { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ audioUrl, isLoading }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => audioRef.current && setCurrentTime(audioRef.current.currentTime);
  const handleLoadedMetadata = () => audioRef.current && setDuration(audioRef.current.duration);
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const waveHeights = [12, 26, 38, 18, 34, 16, 42, 28, 20, 36, 14, 30, 22, 40, 18, 10, 32, 20];

  return (
    <div className="audio-studio-dock">
      <div className="panel-header-row" style={{ marginBottom: '14px' }}>
        <span className="panel-title">Generated Audio</span>
        {audioUrl && !isLoading && (
          <a href={audioUrl} download="generated-speech.mp3" className="btn-download-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="#06120d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download MP3
          </a>
        )}
      </div>

      {isLoading && (
        <div className="loading-audio-state">
          <div className="studio-spinner-ring"></div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Synthesizing speech via neural model...</span>
        </div>
      )}

      {!audioUrl && !isLoading && (
        <div className="empty-audio-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" fill="currentColor" opacity="0.5"/>
            <path d="M19 10v1a7 7 0 01-14 0v-1M12 18v3M9 21h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Your generated speech will appear here.</span>
        </div>
      )}

      {audioUrl && !isLoading && (
        <div className="active-player-deck">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="waveform-canvas-box">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                className={`wave-bar-item ${isPlaying ? 'active-pulse' : ''}`}
                style={{
                  height: isPlaying ? undefined : `${h}px`,
                  animationDelay: `${(i % 5) * 0.12}s`
                }}
              />
            ))}
          </div>

          <div className="player-controls-row">
            <button className="btn-play-trigger" onClick={togglePlay}>
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>
              )}
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.775rem', color: '#9797b3' }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9797b3" strokeWidth="1.8"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                style={{ width: '65px', accentColor: '#8b5cf6', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}