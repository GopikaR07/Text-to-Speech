const API_BASE_URL = 'http://localhost:5000';

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error('Backend health check failed');
  }

  return response.json();
}

export async function generateSpeech(text, voice) {
  const response = await fetch(`${API_BASE_URL}/api/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || 'Speech generation failed'
    );
  }

  const audioBlob = await response.blob();

  return URL.createObjectURL(audioBlob);
}

export async function getVoices() {
  const response = await fetch(`${API_BASE_URL}/api/tts/voices`);

  if (!response.ok) {
    throw new Error('Failed to load voices');
  }

  return response.json();
}