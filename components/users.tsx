import React from 'react';
import { currentChannelID } from '../lib/store/channelSlice';
import { useAppSelector } from '../lib/store/hooks';

interface IUsers {
  minimizeRightSide: boolean;
}

const Users: React.FC<IUsers> = ({ minimizeRightSide }) => {
  const channelID = useAppSelector(currentChannelID);
  return (
    <ul className='menu overflow-hidden'>
      <li>
        <a href=''>Item1</a>
      </li>
      <li>
        <a href=''>Item2888888888888</a>
      </li>
    </ul>
  );
};

export default Users;
