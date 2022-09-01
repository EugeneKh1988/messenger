import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import useSWR from 'swr';
import Image from 'next/image';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const fetcher = (args: string) => fetch(args).then((res) => res.json());
  const { data, error } = useSWR('/api/currentuser', fetcher);
  const user = data && data.user ? data.user : null;

  return (
    <div className='navbar px-2 md:px-[100px] flex grow justify-between items-center shadow-md bg-[#FFFBFE] text-[#1C1B1F]'>
      <div>
        <label className='swap swap-rotate mr-3'>
          <input type='checkbox' />
          <FontAwesomeIcon icon={faBars} className='text-[32px] swap-off' />
          <FontAwesomeIcon icon={faXmark} className='text-[32px] swap-on' />
        </label>
        {user ? (
          <Image src={user.image} width={36} height={36} alt='User avatar' />
        ) : (
          <FontAwesomeIcon icon={faCircleUser} className='text-[32px]' />
        )}
      </div>
      <h1 className='text-[2rem]'>{user ? user.name : 'Messenger app'}</h1>
      <div>
        {session ? (
          <button className='btn' onClick={() => signOut()}>
            Выход
          </button>
        ) : (
          <button className='btn' onClick={() => signIn()}>
            Вход
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
