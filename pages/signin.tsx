import { getProviders, getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import React from 'react';

type TProvider = {
  name: string;
  id: string;
};

type TProviders = {
  [id: string]: TProvider;
};

const SignIn: React.FC<{
  providers: any;
}> = ({ providers }) => {
  return (
    <div className='bg-white w-full h-screen flex justify-center items-center'>
      {Object.values(providers || {}).map((provider: any) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)} className='btn'>
            Вход c {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SignIn;

export const getServerSideProps: any = async (context: any) => {
  const providers = await getProviders();
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }
  return {
    props: { providers },
  };
};
