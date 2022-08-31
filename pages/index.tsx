import type { NextPage } from 'next';
import { useState } from 'react';
import Channels from '../components/channels';
import Layout from '../components/layout';
// icons
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Users from '../components/users';

const Home: NextPage = () => {
  const [minimizeLeftSide, setLeftSideMinimize] = useState(false);
  const [minimizeRightSide, setRightSideMinimize] = useState(false);
  const leftClassName = minimizeLeftSide ? 'max-w-[40px]' : 'max-w-[200px]';
  const rightClassName = minimizeRightSide ? 'max-w-[40px]' : 'max-w-[200px]';

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
          <div className={`bg-white grow ${leftClassName}`}>
            <Channels minimizeLeftSide={minimizeLeftSide} />
          </div>
        </div>
        {/*messenges block*/}
        <div className='grow bg-yellow-400'>Center</div>
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
          <div className={`grow bg-white ${rightClassName}`}>
            <Users minimizeRightSide={minimizeRightSide} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
