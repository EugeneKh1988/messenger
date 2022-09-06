import React, { useState } from 'react';
import { faPlus, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewChannel from './newChannel';
import useSWR from 'swr';

interface IChannels {
  minimizeLeftSide: boolean;
}

interface IChannel {
  _id: string;
  name: string;
  description: string;
  ispublic: boolean;
  adminID: string;
}

const Channels: React.FC<IChannels> = ({ minimizeLeftSide }) => {
  const fetcher = (args: string) => fetch(args).then((res) => res.json());
  const { data, error } = useSWR('/api/channel', fetcher);
  // current channel id
  const [channelID, setChannelID] = useState('');

  const ownChannels: () => React.ReactNode | null = () => {
    if (!data || data?.own.length === 0) {
      return null;
    }
    return (
      <div className='collapse collapse-arrow'>
        <input type='checkbox' />
        <div className='collapse-title'>Мои каналы</div>
        <div className='collapse-content'>
          <ul className='menu overflow-hidden'>
            {data?.own?.map((channel: IChannel) => (
              <li key={channel._id}>
                <a
                  href=''
                  className={channelID === channel._id ? 'active' : ''}
                  onClick={(e) => chooseChannel(e, channel._id)}
                >
                  {channel.name}
                  {channel.ispublic ? <FontAwesomeIcon icon={faLock} /> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const subscribedChannels: () => React.ReactNode | null = () => {
    if (!data || data?.sub.length === 0) {
      return null;
    }
    return (
      <div className='collapse collapse-arrow'>
        <input type='checkbox' />
        <div className='collapse-title'>Подписки</div>
        <div className='collapse-content'>
          <ul className='menu overflow-hidden'>
            {data?.sub?.map((channel: IChannel) => (
              <li key={channel._id}>
                <a
                  href=''
                  className={channelID === channel._id ? 'active' : ''}
                  onClick={(e) => chooseChannel(e, channel._id)}
                >
                  {channel.name}
                  {channel.ispublic ? <FontAwesomeIcon icon={faLock} /> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const chooseChannel: (
    e: React.MouseEvent<HTMLAnchorElement>,
    channelID: string
  ) => void = (e, channelID) => {
    e.preventDefault();
    setChannelID(channelID);
  };

  return (
    <>
      <ul className='menu overflow-hidden'>
        <li>
          <label htmlFor='modal-new-channel' className='modal-button'>
            <p>Создать</p> <FontAwesomeIcon icon={faPlus} />
          </label>
        </li>
      </ul>
      {ownChannels()}
      {subscribedChannels()}
      <NewChannel />
    </>
  );
};

export default Channels;
