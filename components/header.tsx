import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  return (
    <div className='navbar px-2 md:px-[100px] flex grow justify-between items-center shadow-md bg-[#FFFBFE] text-[#1C1B1F]'>
      <div>
        <label className='swap swap-rotate'>
          <input type='checkbox' />
          <FontAwesomeIcon icon={faBars} className='text-[32px] swap-off' />
          <FontAwesomeIcon icon={faXmark} className='text-[32px] swap-on' />
        </label>
        <FontAwesomeIcon icon={faCircleUser} className='text-[32px] ml-3' />
      </div>
      <h1 className='text-[32px]'>Messenger app</h1>
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
