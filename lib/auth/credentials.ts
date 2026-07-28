export type Credentials = {
  accessToken: string;
  refreshToken: string;
};

type CredentialEvent = 'changed' | 'cleared';
type CredentialListener = (event: CredentialEvent) => void;

let credentials: Credentials | null = null;
const listeners = new Set<CredentialListener>();

export const getCredentials = (): Credentials | null => credentials;

export const setCredentials = (nextCredentials: Credentials): void => {
  credentials = nextCredentials;
  listeners.forEach((listener) => listener('changed'));
};

export const clearCredentials = (): void => {
  credentials = null;
  listeners.forEach((listener) => listener('cleared'));
};

export const subscribeToCredentials = (listener: CredentialListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
