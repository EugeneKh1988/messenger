import React from 'react';
import Head from 'next/head';
import Header from './header';

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className='container mx-auto'>
      <Head>
        <title>Messenger App</title>
        <meta name='description' content='Messenger app generated by next.js' />
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
      </Head>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
