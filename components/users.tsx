import React, { useEffect, useState } from 'react';
import {
  clearChannelData,
  currentAdminID,
  currentChannelID,
} from '../lib/store/channelSlice';
import { useAppDispatch, useAppSelector } from '../lib/store/hooks';
import { IDbUser } from '../lib/user';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faEllipsisVertical,
  faCircleArrowRight,
  faUserXmark,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useSWRConfig } from 'swr';

interface IUsers {
  minimizeRightSide: boolean;
}

const Users: React.FC<IUsers> = ({ minimizeRightSide }) => {
  const channelID = useAppSelector(currentChannelID);
  const adminID = useAppSelector(currentAdminID);
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
  // for revalidate channels
  const { mutate } = useSWRConfig();
  // for dispatch to store
  const dispatch = useAppDispatch();

  useEffect(() => {
    setPage(0);
    loadUsers(0, true);
  }, [channelID]);

  useEffect(() => {
    const timer = setTimeout(() => loadCurrentPage(), 10000);
    return () => clearTimeout(timer);
  });

  const loadCurrentPage: () => void = async () => {
    if (!channelID) {
      return;
    }
    try {
      let url = new URL('/api/userChannel', window.location.href);
      url.searchParams.append('channelID', channelID);
      if (page === 0) {
        url.searchParams.append('page', (page + 1).toString());
      } else if (page > 0) {
        url.searchParams.append('page', page.toString());
      }
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);

      if (result && result.users) {
        // set users
        setUsers(result.users);
      } else {
        setUsers([]);
      }
      //console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const loadUsers: (page: number, forward: boolean) => void = async (
    page,
    forward
  ) => {
    if (!channelID) {
      return;
    }
    try {
      let url = new URL('/api/userChannel', window.location.href);
      url.searchParams.append('channelID', channelID);
      if (forward) {
        url.searchParams.append('page', (page + 1).toString());
      } else if (!forward && page > 1) {
        url.searchParams.append('page', (page - 1).toString());
      } else {
        url.searchParams.append('page', page.toString());
      }
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);

      if (result && result.users) {
        // set users
        setUsers(result.users);
        if (forward) {
          // next page if data is exist
          if (result.users.length > 0) setPage((page) => ++page);
        } else {
          if (page > 1) setPage((page) => --page);
        }
      } else {
        setUsers([]);
      }
      //console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // leave from some channel
  const channelLeave: (channelID: string, outerUserID: string) => void = async (
    channelID,
    outerUserID
  ) => {
    if (!channelID) {
      return;
    }
    let options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelID }),
    };
    if (adminID === outerUserID) {
      options.body = JSON.stringify({ channelID, outerUserID });
    }
    try {
      const response = await fetch('/api/userChannel', options);
      const resultDeletion = await response.json();
      // if not deleted
      if (resultDeletion && !resultDeletion.status) {
        return;
      }
      // clear channel data
      dispatch(clearChannelData);
      // for reload channels
      mutate('/api/channel');
      // for reload users
      let url = new URL('/api/userChannel', window.location.href);
      url.searchParams.append('channelID', channelID);
      url.searchParams.append('page', page.toString());
      const userResponsePromise = await fetch(url);
      const res = await userResponsePromise.json();
      setUsers(res.users);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col justify-between h-full'>
      <ul className='menu pb-8 scrollbar-thin overflow-y-auto'>
        {users?.map((user: IDbUser) => (
          <li key={user._id}>
            <div className='flex items-center flex-nowrap'>
              <Image
                src={user.photo}
                width={36}
                height={36}
                alt='User avatar'
              />
              <span className='mr-2'>{user.name}</span>
              <div className='dropdown dropdown-end'>
                <label tabIndex={0} className='btn'>
                  <FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon>
                </label>
                <ul
                  tabIndex={0}
                  className='dropdown-content menu p-2 shadow bg-white rounded-box'
                >
                  <li onClick={() => channelLeave(channelID, user._id || '')}>
                    <span>
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                      ></FontAwesomeIcon>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        ))}
        {channelID && users?.length === 0 ? (
          <li>
            <div className='flex items-center'>
              <FontAwesomeIcon icon={faUserXmark}></FontAwesomeIcon>
              <span>No users</span>
            </div>
          </li>
        ) : null}
      </ul>
      {channelID ? (
        <div className='flex justify-between items-center px-3 pb-2'>
          <FontAwesomeIcon
            icon={faCircleArrowLeft}
            className='text-[32px] cursor-pointer'
            onClick={() => loadUsers(page, false)}
          ></FontAwesomeIcon>
          <span className='badge mx-3'>{page}</span>
          <FontAwesomeIcon
            icon={faCircleArrowRight}
            className='text-[32px] cursor-pointer'
            onClick={() => loadUsers(page, true)}
          ></FontAwesomeIcon>
        </div>
      ) : null}
    </div>
  );
};

export default Users;
