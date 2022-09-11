import React, { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { IChannel } from './channels';
// icons
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IChannelExt extends IChannel {
  canEnter?: boolean;
  canLeave?: boolean;
  isAdmin?: boolean;
}

const EnterToChannel: React.FC = () => {
  // name of channel
  const [name, setName] = useState('');
  // page number
  const [page, setPage] = useState(0);
  // found channels by name
  const [foundChannels, setFoundChannels] = useState<IChannelExt[]>([]);
  const [buttonDisabled, setButtonState] = useState(false);
  // return user channels
  const fetcher = (args: string) => fetch(args).then((res) => res.json());
  const { data: ownOrSubChannels, error } = useSWR('/api/channel', fetcher);
  // for revalidate channels
  const { mutate } = useSWRConfig();

  const next: () => void = async () => {
    // return if name is not set
    if (!name) {
      return;
    }
    setButtonState(true);
    try {
      let url = new URL('/api/channel', window.location.href);
      url.searchParams.append('name', name);
      url.searchParams.append('page', (page + 1).toString());
      const response = await fetch(url);
      const result = await response.json();
      if (result && result.channels) {
        // process channels
        const channels = processChannels(ownOrSubChannels, result.channels);
        // set channels
        setFoundChannels(channels);
        console.log(channels);
        // next page if data is exist
        if (result.channels.length > 0) setPage((page) => ++page);
        // for reload channels
        mutate('/api/channel');
      }
      //console.log(result);
    } catch (error) {
      console.log(error);
    }
    setButtonState(false);
  };

  const prev: () => void = async () => {
    // return if name is not set
    if (!name) {
      return;
    }
    setButtonState(true);
    try {
      let url = new URL('/api/channel', window.location.href);
      url.searchParams.append('name', name);
      if (page > 1) {
        url.searchParams.append('page', (page - 1).toString());
      } else {
        url.searchParams.append('page', page.toString());
      }
      const response = await fetch(url);
      const result = await response.json();
      if (result && result.channels) {
        // process channels
        const channels = processChannels(ownOrSubChannels, result.channels);
        // set channels
        setFoundChannels(channels);
        console.log(channels);
        // next page if data is exist
        if (result.channels.length > 1 && page > 1) setPage((page) => --page);
        // for reload channels
        mutate('/api/channel');
      }
      //console.log(result);
    } catch (error) {
      console.log(error);
    }
    setButtonState(false);
  };

  //
  const processChannels: (
    data: { own: IChannelExt[]; sub: IChannelExt[] },
    channels: IChannel[]
  ) => IChannelExt[] = (data, channels) => {
    // if own and sub channels was not loaded
    if (!data || !data?.own || !data?.sub) {
      return channels;
    }
    // if channels is not defined or empty
    if (!channels || channels?.length === 0) {
      return [];
    }
    let _channels: IChannelExt[] = [];
    channels.forEach((channelItem) => {
      let foundOwn = data.own.filter(
        (ownChannel: IChannel) => ownChannel._id === channelItem._id
      );
      let foundSub = data.sub.filter(
        (subChannel: IChannel) => subChannel._id === channelItem._id
      );
      if (foundOwn && foundOwn.length > 0) {
        _channels.push({
          ...channelItem,
          canEnter: false,
          canLeave: false,
          isAdmin: true,
        });
      } else if (foundSub && foundSub.length > 0) {
        _channels.push({
          ...channelItem,
          canEnter: false,
          canLeave: true,
          isAdmin: false,
        });
      } else {
        // if channel is private
        let canEnter = false;
        if (channelItem.ispublic) {
          canEnter = true;
        }
        _channels.push({
          ...channelItem,
          canEnter,
          canLeave: false,
          isAdmin: false,
        });
      }
    });
    return _channels;
  };

  // enter to some channel
  const channelEnter: (channelID: string) => void = async (channelID) => {
    if (!channelID) {
      return;
    }
    try {
      const response = await fetch('/api/userChannel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelID }),
      });
      const result = await response.json();
      // for reload channels
      const userchannels = await mutate('/api/channel');
      console.log('chan', userchannels);
      setFoundChannels(processChannels(userchannels, foundChannels));
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // leave from some channel
  const channelLeave: (channelID: string) => void = async (channelID) => {
    if (!channelID) {
      return;
    }
    try {
      const response = await fetch('/api/userChannel', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelID }),
      });
      const result = await response.json();
      // for reload channels
      const userchannels = await mutate('/api/channel');
      console.log('chan', userchannels);
      setFoundChannels(processChannels(userchannels, foundChannels));
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <input type='checkbox' className='modal-toggle' id='modal-find-channel' />
      <div className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box bg-white relative'>
          <label
            htmlFor='modal-find-channel'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <input
            type='text'
            placeholder='Имя канала'
            className='w-full max-w-xs input mb-3 text-white'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPage(0);
            }}
          />
          <ul className='w-full max-w-xs max-h-[200px] overflow-y-auto scrollbar-thin menu'>
            {foundChannels.map((channel: IChannelExt) => (
              <li key={channel._id}>
                <div className='flex justify-between'>
                  <div>{channel.name}</div>
                  <div className='flex justify-end'>
                    {!channel.isAdmin && !channel.ispublic ? (
                      <FontAwesomeIcon
                        icon={faLock}
                        className='text-[20px] cursor-pointer ml-2'
                      ></FontAwesomeIcon>
                    ) : null}
                    {channel.isAdmin ? (
                      <FontAwesomeIcon
                        icon={faUserTie}
                        className='text-[20px] cursor-pointer ml-2'
                      ></FontAwesomeIcon>
                    ) : null}
                    {channel.canEnter ? (
                      <FontAwesomeIcon
                        icon={faRightToBracket}
                        className='text-[20px] cursor-pointer ml-2'
                        onClick={() => channelEnter(channel._id)}
                      ></FontAwesomeIcon>
                    ) : null}
                    {channel.canLeave ? (
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className='text-[20px] cursor-pointer ml-2'
                        onClick={() => channelLeave(channel._id)}
                      ></FontAwesomeIcon>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
            {foundChannels?.length === 0 ? <p>Ничего не найдено</p> : null}
          </ul>
          <div className='w-full max-w-xs flex justify-between'>
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className='text-[32px] cursor-pointer'
              onClick={() => prev()}
            ></FontAwesomeIcon>
            <span className='badge ml-2'>{page} стр.</span>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className='text-[32px] cursor-pointer'
              onClick={() => next()}
            ></FontAwesomeIcon>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnterToChannel;
