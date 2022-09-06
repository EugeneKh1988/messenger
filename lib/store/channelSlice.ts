import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface IChannelState {
  currentChannelID: string;
}

const initialState: IChannelState = {
  currentChannelID: '',
};

export const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setCurrentChannel(state, action: PayloadAction<string>) {
      state.currentChannelID = action.payload;
    },
  },
});

export const { setCurrentChannel } = channelSlice.actions;
export const currentChannelID = (state: RootState) =>
  state.channel.currentChannelID;
export default channelSlice.reducer;
