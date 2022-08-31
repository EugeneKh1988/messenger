import React from 'react';

interface IChannels {
  minimizeLeftSide: boolean;
}

const Channels: React.FC<IChannels> = ({ minimizeLeftSide }) => {
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

export default Channels;
