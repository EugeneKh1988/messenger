import { configureStore } from '@reduxjs/toolkit';
import channelReducer from './channelSlice';

export const store = configureStore({
  reducer: {
    channel: channelReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// dispatch type
export type AppDispatch = typeof store.dispatch;