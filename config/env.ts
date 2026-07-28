const DEFAULT_API_BASE_URL = 'http://52.62.25.92';

const parsePublicUrl = (value: string | undefined, fallback?: string): string | undefined => {
  const candidate = value?.trim() || fallback;

  if (!candidate) {
    return undefined;
  }

  const parsed = new URL(candidate);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Unsupported public URL protocol: ${parsed.protocol}`);
  }

  return candidate.replace(/\/+$/, '');
};

const apiBaseUrl = parsePublicUrl(process.env.NEXT_PUBLIC_API_BASE_URL, DEFAULT_API_BASE_URL);

if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is required');
}

export const env = {
  apiBaseUrl,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || undefined,
  googleRedirectUri: parsePublicUrl(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI),
} as const;

export const isGoogleOAuthConfigured = Boolean(env.googleClientId && env.googleRedirectUri);
