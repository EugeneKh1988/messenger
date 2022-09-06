import React, { useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface INewChannel {
  viewState?: boolean;
  setClose?: (state: boolean) => void;
}

const NewChannel: React.FC<INewChannel> = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [channelState, setChannelState] = useState(false);
  const [buttonDisabled, setButtonState] = useState(false);

  const clearFields: () => void = () => {
    setName('');
    setDescription('');
    setChannelState(false);
  };

  const createChannel: () => void = async () => {
    // return if name is not set
    if (!name) {
      return;
    }
    setButtonState(true);
    try {
      const response = await fetch('/api/channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, ispublic: channelState, description }),
      });
      const result = await response.json();
      if (result && result.status) {
        clearFields();
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    setButtonState(false);
  };
  return (
    <>
      <input type='checkbox' className='modal-toggle' id='modal-new-channel' />
      <div className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box bg-white relative'>
          <label
            htmlFor='modal-new-channel'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <input
            type='text'
            placeholder='Имя канала'
            className='w-full max-w-xs input mb-3'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className='w-full max-w-xs textarea mb-3'
            placeholder='Описание канала'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className='form-control w-full max-w-xs'>
            <label className='label cursor-pointer'>
              <span className='label-text'>Сделать приватным?</span>
              <input
                type='checkbox'
                className='checbox checkbox-primary checkbox-md'
                checked={channelState}
                onChange={(e) => setChannelState(e.target.checked)}
              />
            </label>
          </div>
          <div className='w-full max-w-xs'>
            <button
              className={buttonDisabled ? 'btn mx-auto loading' : 'btn mx-auto'}
              onClick={() => createChannel()}
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewChannel;
