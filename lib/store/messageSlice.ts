import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IMessage {
  _id?: string;
  channelID: string;
  userID: string;
  message: string;
  date: number;
}

export interface IDbUserPart {
  _id?: string;
  photo: string;
  name: string;
}

interface IMessageState {
  messages: { [channelID: string]: IMessage[] };
  users: { [userID: string]: IDbUserPart };
}

const initialState: IMessageState = {
  messages: {},
  users: {},
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessages(state, action: PayloadAction<IMessage[]>) {
      const messages: IMessage[] = action.payload;
      messages.forEach((message: IMessage) => {
        let currentMessages = state.messages[message.channelID];
        // add empty array
        if (!currentMessages) {
          state.messages[message.channelID] = [];
        }
        // find message by id
        let foundMessage = currentMessages.filter(
          (addedMessage: IMessage) => addedMessage._id === message._id
        );
        // push new message
        if (foundMessage && foundMessage.length === 0) {
          state.messages[message.channelID].push(message);
        }
      });
    },
    setMessages(
      state,
      action: PayloadAction<{ channelID: string; messages: IMessage[] }>
    ) {
      const channelID = action.payload.channelID;
      const messages = action.payload.messages;
      state.messages[channelID] = messages;
    },
    setUsers(state, action: PayloadAction<{ users: IDbUserPart[] }>) {
      const users = action.payload.users;
      users.forEach((user: IDbUserPart) => {
        if (user._id) state.users[user._id] = user;
      });
    },
    clearUsers(state) {
      state.users = {};
    },
  },
});

export const { addMessages, setMessages, setUsers, clearUsers } =
  messageSlice.actions;
export default messageSlice.reducer;
