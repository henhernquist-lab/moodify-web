
const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID"; // Replace with your client ID
const REDIRECT_URI = "http://localhost:3000/callback"; // Replace with your redirect URI

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-library-read",
  "user-library-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
];

function generateRandomString(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(input: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateCodeVerifier(): string {
  const codeVerifier = generateRandomString(128);
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);
  return codeVerifier;
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}

export async function redirectToSpotifyAuth(): Promise<void> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('response_type', 'code');
  params.append('redirect_uri', REDIRECT_URI);
  params.append('scope', scopes.join(' '));
  params.append('code_challenge_method', 'S256');
  params.append('code_challenge', challenge);

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function handleCallback(): Promise<string> {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const verifier = sessionStorage.getItem('spotify_code_verifier');

  if (!code || !verifier) {
    throw new Error('Authorization code or verifier not found.');
  }

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('code_verifier', verifier);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (data.access_token) {
    const expiryTime = Date.now() + data.expires_in * 1000;
    localStorage.setItem('moodify_spotify_token', JSON.stringify({ token: data.access_token, expiry: expiryTime, refresh_token: data.refresh_token }));
    sessionStorage.removeItem('spotify_code_verifier');
    return data.access_token;
  } else {
    throw new Error('Failed to retrieve access token.');
  }
}

export async function getValidToken(): Promise<string | null> {
  const storedToken = localStorage.getItem('moodify_spotify_token');
  if (!storedToken) {
    return null;
  }

  const { token, expiry, refresh_token } = JSON.parse(storedToken);

  if (Date.now() < expiry) {
    return token;
  }

  // Token expired, attempt refresh
  if (refresh_token) {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.access_token) {
      const newExpiryTime = Date.now() + data.expires_in * 1000;
      localStorage.setItem('moodify_spotify_token', JSON.stringify({ token: data.access_token, expiry: newExpiryTime, refresh_token: data.refresh_token || refresh_token }));
      return data.access_token;
    } else {
      console.error('Failed to refresh token:', data);
      localStorage.removeItem('moodify_spotify_token'); // Clear invalid token
      return null;
    }
  } else {
    localStorage.removeItem('moodify_spotify_token'); // No refresh token, clear invalid token
    return null;
  }
}

export function isAuthenticated(): boolean {
  const storedToken = localStorage.getItem('moodify_spotify_token');
  if (!storedToken) {
    return false;
  }
  const { expiry } = JSON.parse(storedToken);
  return Date.now() < expiry;
}
