import '../styles/globals.css';
import type { AppProps } from 'next/app';
// font awesome
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
// next-auth
import { SessionProvider } from 'next-auth/react';
config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
