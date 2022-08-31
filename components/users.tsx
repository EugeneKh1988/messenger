import React from 'react';

interface IUsers {
  minimizeRightSide: boolean;
}

const Users: React.FC<IUsers> = ({ minimizeRightSide }) => {
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
