import '../styles/globals.css';
import type { AppProps } from 'next/app';
// font awesome
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
// redux
import { Provider } from 'react-redux';
import { store } from '../lib/store/store';
// next-auth
import { SessionProvider } from 'next-auth/react';
config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
