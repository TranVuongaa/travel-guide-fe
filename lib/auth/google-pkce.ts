import {env, isGoogleOAuthConfigured} from '@/config/env';

import type {OAuthCodeInput} from '@/lib/api/contracts';

const OAUTH_MESSAGE_TYPE = 'vanno-google-oauth';

type GoogleOAuthMessage = {
  type: typeof OAUTH_MESSAGE_TYPE;
  code?: string;
  error?: string;
  state?: string;
};

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const createRandomValue = (length: number): string => {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
};

const createChallenge = async (verifier: string): Promise<string> => {
  const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return toBase64Url(new Uint8Array(digest));
};

export const openGoogleOAuthPopup = async (): Promise<OAuthCodeInput> => {
  if (!isGoogleOAuthConfigured || !env.googleClientId || !env.googleRedirectUri) {
    throw new Error('Google OAuth chưa được cấu hình.');
  }

  const googleClientId = env.googleClientId;
  const googleRedirectUri = env.googleRedirectUri;
  const state = createRandomValue(32);
  const codeVerifier = createRandomValue(64);
  const codeChallenge = await createChallenge(codeVerifier);
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizationUrl.search = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: googleRedirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  }).toString();

  const popup = window.open(
    authorizationUrl.toString(),
    'vanno-google-oauth',
    'popup=yes,width=520,height=720,noopener=no,noreferrer=no',
  );

  if (!popup) {
    throw new Error('Trình duyệt đã chặn cửa sổ đăng nhập Google.');
  }

  return new Promise<OAuthCodeInput>((resolve, reject) => {
    const cleanup = (): void => {
      window.removeEventListener('message', handleMessage);
      window.clearInterval(closedWatcher);
      if (!popup.closed) {
        popup.close();
      }
    };

    const handleMessage = (event: MessageEvent<unknown>): void => {
      if (event.origin !== window.location.origin || typeof event.data !== 'object' || event.data === null) {
        return;
      }

      const message = event.data as Partial<GoogleOAuthMessage>;
      if (message.type !== OAUTH_MESSAGE_TYPE || message.state !== state) {
        return;
      }

      cleanup();
      if (message.error || !message.code) {
        reject(new Error('Google không trả về mã xác thực hợp lệ.'));
        return;
      }

      resolve({
        authorizationCode: message.code,
        redirectUri: googleRedirectUri,
        codeVerifier,
      });
    };

    const closedWatcher = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error('Cửa sổ đăng nhập Google đã đóng.'));
      }
    }, 500);

    window.addEventListener('message', handleMessage);
  });
};

export const createGoogleCallbackMessage = (
  searchParams: URLSearchParams,
): GoogleOAuthMessage => ({
  type: OAUTH_MESSAGE_TYPE,
  code: searchParams.get('code') ?? undefined,
  error: searchParams.get('error') ?? undefined,
  state: searchParams.get('state') ?? undefined,
});
