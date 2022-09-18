import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface IChannelState {
  currentChannelID: string;
  adminID: string;
}

const initialState: IChannelState = {
  currentChannelID: '',
  adminID: '',
};

export const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setCurrentChannel(state, action: PayloadAction<string>) {
      state.currentChannelID = action.payload;
    },
    setAdminID(state, action: PayloadAction<string>) {
      state.adminID = action.payload;
    },
    clearChannelData(state) {
      state.adminID = '';
      state.currentChannelID = '';
    },
  },
});

export const { setCurrentChannel, setAdminID, clearChannelData } =
  channelSlice.actions;
export const currentChannelID = (state: RootState) =>
  state.channel.currentChannelID;
export const currentAdminID = (state: RootState) => state.channel.adminID;
export default channelSlice.reducer;
