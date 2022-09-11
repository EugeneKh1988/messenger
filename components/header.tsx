import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import useSWR from 'swr';
import Image from 'next/image';
import EnterToChannel from './EnterToChannel';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const fetcher = (args: string) => fetch(args).then((res) => res.json());
  const { data, error } = useSWR('/api/currentuser', fetcher);
  const user = data && data.user ? data.user : null;

  return (
    <div className='navbar px-2 md:px-[100px] flex grow justify-between items-center shadow-md bg-[#FFFBFE] text-[#1C1B1F]'>
      <div>
        <div className='dropdown'>
          <label tabIndex={0} className='btn mr-3'>
            <FontAwesomeIcon icon={faBars} className='text-[32px] text-white' />
          </label>
          <ul
            tabIndex={0}
            className='menu dropdown-content p-2 shadow bg-white rounded-box w-52 mt-4'
          >
            <li>
              <label htmlFor='modal-find-channel' className='modal-button'>
                Найти канал
              </label>
            </li>
          </ul>
        </div>
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
      <EnterToChannel />
    </div>
  );
};

export default Header;
