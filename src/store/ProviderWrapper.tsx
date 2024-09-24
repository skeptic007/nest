'use client';

import { ReactNode } from 'react';

// map styles
import 'mapbox-gl/dist/mapbox-gl.css';

// third-party
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project-import
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';

import ThemeCustomization from 'themes';

import { persister, store } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';

import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

import client from '../../apollo.config';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <PersistGate loading={null} persistor={persister}>
          <ConfigProvider>
            <ThemeCustomization>
              <RTLLayout>
                <Locales>
                  <NavigationScroll>
                    <AuthProvider>
                      <Notistack>
                        <SessionProvider>
                          <Snackbar />
                          {children}
                        </SessionProvider>
                      </Notistack>
                    </AuthProvider>
                  </NavigationScroll>
                </Locales>
              </RTLLayout>
            </ThemeCustomization>
          </ConfigProvider>
        </PersistGate>
      </ApolloProvider>
    </Provider>
  );
}
