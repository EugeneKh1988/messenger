import type { NextPage } from 'next';
import { useState } from 'react';
import Channels from '../components/channels';
import Layout from '../components/layout';
// icons
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Users from '../components/users';
import Messages from '../components/messages';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const Home: NextPage = () => {
  const [minimizeLeftSide, setLeftSideMinimize] = useState(false);
  const [minimizeRightSide, setRightSideMinimize] = useState(false);
  const leftClassName = minimizeLeftSide ? 'max-w-[0]' : 'max-w-[200px]';
  const rightClassName = minimizeRightSide ? 'max-w-[0]' : 'max-w-[200px]';
  // user
  const { data: session, status } = useSession();
  const fetcher = (args: string) => fetch(args).then((res) => res.json());
  const { data, error } = useSWR('/api/currentuser', fetcher);
  const user = data && data.user ? data.user : null;

  return (
    <Layout>
      <div className='flex justify-evenly items-stretch grow h-[calc(100vh-4rem)]'>
        {/*left side*/}
        <div className='indicator'>
          <div className='indicator-item indicator-end indicator-middle'>
            <button
              className='btn btn-circle'
              onClick={() => setLeftSideMinimize(!minimizeLeftSide)}
            >
              {minimizeLeftSide ? (
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className='text-white text-[24px]'
                />
              ) : (
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className='text-white text-[24px]'
                />
              )}
            </button>
          </div>
          <div
            className={`bg-white grow overflow-y-auto scrollbar ${leftClassName}`}
          >
            {user ? <Channels minimizeLeftSide={minimizeLeftSide} /> : null}
          </div>
        </div>
        {/*messenges block*/}
        <div className='grow bg-slate-100 overflow-y-auto scrollbar'>
          {user ? <Messages /> : null}
        </div>
        {/*right side*/}
        <div className='indicator'>
          <div className='indicator-item indicator-start indicator-middle'>
            <button
              className='btn btn-circle'
              onClick={() => setRightSideMinimize(!minimizeRightSide)}
            >
              {minimizeRightSide ? (
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className='text-white text-[24px]'
                />
              ) : (
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className='text-white text-[24px]'
                />
              )}
            </button>
          </div>
          <div
            className={`grow bg-white overflow-y-auto scrollbar ${rightClassName}`}
          >
            {user ? <Users minimizeRightSide={minimizeRightSide} /> : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
