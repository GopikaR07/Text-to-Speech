import React from 'react';

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#fca5a5',
      padding: '14px 18px',
      borderRadius: '14px',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backdropFilter: 'blur(10px)'
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01" strokeLinecap="round"/>
      </svg>
      <span>{message}</span>
    </div>
  );
}