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

  const hasAudio = Boolean(audioUrl) && !isLoading;

  return (
    <div className="audio-studio-dock">
      <div className="panel-header-row" style={{ marginBottom: '14px' }}>
        <span className="panel-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: '8px', verticalAlign: '-2px' }}>
            <path d="M3 12h2l2-7 4 14 3-10 2 6h5"/>
          </svg>
          Generated Audio
        </span>
      </div>

      {isLoading && (
        <div className="loading-audio-state">
          <div className="studio-spinner-ring"></div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Synthesizing speech via neural model...</span>
        </div>
      )}

      {!audioUrl && !isLoading && (
        <div className="empty-audio-state">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" fill="currentColor" opacity="0.5"/>
            <path d="M19 10v1a7 7 0 01-14 0v-1M12 18v3M9 21h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Your generated speech will appear here.</span>
        </div>
      )}

      {hasAudio && (
        <div className="player-bar-row">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          <button className="btn-play-trigger" onClick={togglePlay}>
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>
            )}
          </button>

          <span className="time-label">{formatTime(currentTime)}</span>

          <input
            type="range"
            className="seek-range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
          />

          <span className="time-label">{formatTime(duration)}</span>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" style={{ flexShrink: 0 }}>
            <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
          <input
            type="range"
            className="volume-range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
          />

          <a href={audioUrl} download="generated-speech.mp3" className="btn-download-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="#06120d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
}