'use client';

import {useEffect, useState} from 'react';
import {Provider} from 'react-redux';

import {subscribeToCredentials} from '@/lib/auth/credentials';
import {sessionCleared} from '@/store/slices/auth.slice';
import {makeStore} from '@/store/store';

export function AppProviders({children}: Readonly<{children: React.ReactNode}>) {
  const [store] = useState(makeStore);

  useEffect(() => {
    return subscribeToCredentials((event) => {
      if (event === 'cleared') {
        store.dispatch(sessionCleared());
      }
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
