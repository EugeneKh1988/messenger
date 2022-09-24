import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { currentChannelID } from '../lib/store/channelSlice';
import { useAppDispatch, useAppSelector } from '../lib/store/hooks';
import { IDbUserPart, setMessages, setUsers } from '../lib/store/messageSlice';
import { RootState } from '../lib/store/store';
import { IMessage } from '../lib/dbMessages';
import Image from 'next/image';

interface MessagesWithUsers {
  messages: IMessage[];
  users: IDbUserPart[];
}

const Messages: React.FC = () => {
  // store
  const channelID = useAppSelector(currentChannelID);
  const storedMessages = useAppSelector((state: RootState) => {
    if (state.message.messages[channelID]) {
      return state.message.messages[channelID];
    }
    return [];
  });
  const storedUsers: { [userID: string]: IDbUserPart } = useAppSelector(
    (state: RootState) => {
      if (state.message.users) {
        return state.message.users;
      }
      return {};
    }
  );
  const dispatch = useAppDispatch();
  // message
  const [message, setMessage] = useState('');
  // return channel messages
  const fetcher = (args: string) => fetch(args).then((res) => res.json());
  const { data: allMessages, error } = useSWR(
    channelID ? `/api/messages?channelID=${channelID}` : null,
    fetcher,
    {
      onSuccess: (data: MessagesWithUsers) => {
        dispatch(setMessages({ channelID, messages: data.messages }));
        dispatch(setUsers({ users: data.users }));
      },
      refreshInterval: 10 * 1000,
    }
  );

  const sendMessage: () => void = async () => {
    if (!message) {
      return;
    }
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelID, message }),
      });
      const result = await response.json();
      // for reload messages
      const data: MessagesWithUsers = await mutate(
        `/api/messages?channelID=${channelID}`
      );
      if (data && data.messages && data.users) {
        dispatch(setMessages({ channelID, messages: data.messages }));
        dispatch(setUsers({ users: data.users }));
      }
      setMessage('');
      ///console.log('chan', userchannels);
      //setFoundChannels(processChannels(userchannels, foundChannels));
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate: (timestamp: number) => string = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const year = date.getFullYear();
    // Hours part from the timestamp
    const hours =
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    // Minutes part from the timestamp
    const minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    // Seconds part from the timestamp
    const seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className='flex flex-col h-full justify-between'>
      <div className='overflow-y-auto scrollbar-thin px-5 py-4'>
        {storedMessages.map((message: IMessage) => (
          <div key={message._id} className='w-full bg-slate-50 rounded mb-2'>
            <div className='flex'>
              {storedUsers && storedUsers[message.userID] ? (
                <>
                  <Image
                    src={storedUsers[message.userID].photo}
                    width={26}
                    height={26}
                    alt={storedUsers[message.userID].name}
                  />
                  <p className='ml-2'>{storedUsers[message.userID].name}</p>
                </>
              ) : null}
            </div>
            <p className='mt-1 text-black'>{message.message}</p>
            <p className='text-right'>{formatDate(message.date)}</p>
          </div>
        ))}
      </div>
      <div className='form-control p-2'>
        <div className='input-group'>
          <input
            type='text'
            placeholder='Сообщение'
            className='input input-bordered bg-white w-full'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
          />
          <button
            className='btn btn-square text-white'
            onClick={() => sendMessage()}
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className='text-[20px]'
            ></FontAwesomeIcon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
